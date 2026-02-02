// app/actions/gdrive.ts
'use server'
import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';
import { Readable } from 'stream'; 
import { revalidatePath } from 'next/cache';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];


async function getDriveService() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}


export async function uploadToDrive(formData: FormData, programId: string, category: string) {
  try {
    const file = formData.get('file') as File;
    const customName = formData.get('displayName') as string; // Ambil nama dari input baru
    const drive = await getDriveService();
    
    // Gunakan customName jika ada, jika tidak gunakan file.name asli
    const finalName = customName || file.name;

    const buffer = Buffer.from(await file.arrayBuffer());
    const mediaStream = Readable.from(buffer);

    const fileMetadata = {
      name: finalName, // Nama di Google Drive akan mengikuti input user
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    };

    const gdriveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: { mimeType: file.type, body: mediaStream },
      fields: 'id, webViewLink, webContentLink',
    });

    const { id: gFileId, webViewLink, webContentLink } = gdriveResponse.data;

    const { data, error: sbError } = await supabase.from('File').insert({
      program_id: programId,
      gdrive_id: gFileId,
      view_link: webViewLink,
      download_link: webContentLink,
      category: category,
      name: finalName, // Simpan nama kustom ke database
      status: 'active'
    }).select().single();

    revalidatePath(`/program/${programId}`);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFile(fileId: number, gdriveId: string, programId: string) {
  try {
    const drive = await getDriveService();

    // 1. Hapus file dari Google Drive
    try {
      await drive.files.delete({
        fileId: gdriveId,
      });
      console.log(`File GDrive ${gdriveId} berhasil dihapus.`);
    } catch (gError: any) {
      // Jika file sudah dihapus manual di Drive, abaikan error 404
      if (gError.code !== 404) throw gError;
    }

    // 2. Hapus data dari Supabase
    const { error: sbError } = await supabase
      .from('File')
      .delete()
      .eq('id', fileId);

    if (sbError) throw sbError;

    // 3. Update tampilan secara realtime
    revalidatePath(`/program/${programId}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Kesalahan Hapus:", error.message);
    return { success: false, error: error.message };
  }
}
// app/actions/gdrive.ts

export async function updateFile(
  fileId: number,          // ID di database Supabase
  gdriveId: string,        // ID di Google Drive
  formData: FormData, 
  programId: string
) {
  try {
    const drive = await getDriveService();
    const newFile = formData.get('file') as File;
    const newName = formData.get('displayName') as string;
    const category = formData.get('category') as string;

    const updateData: any = {
      name: newName,
      category: category,
    };

    // 1. Jika ada file baru yang diunggah, update konten di Google Drive
    if (newFile && newFile.size > 0) {
      const buffer = Buffer.from(await newFile.arrayBuffer());
      await drive.files.update({
        fileId: gdriveId,
        media: { mimeType: newFile.type, body: Readable.from(buffer) },
      });
    }

    // 2. Update Nama di Google Drive
    await drive.files.update({
      fileId: gdriveId,
      requestBody: { name: newName },
    });

    // 3. Update data di Supabase
    const { error } = await supabase
      .from('File')
      .update(updateData)
      .eq('id', fileId);

    if (error) throw error;

    revalidatePath(`/program/${programId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}