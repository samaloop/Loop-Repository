// app/actions/gdrive.ts
'use server'
import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';
import { Readable } from 'stream'; // 

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// async function getDriveService() {
//   try {
//     const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);

//     // Perbaikan khusus untuk private_key jika ada error format \n
//     if (credentials.private_key) {
//       credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
//     }

//     const auth = new google.auth.GoogleAuth({
//       credentials,
//       scopes: ['https://www.googleapis.com/auth/drive.file'],
//     });

//     return google.drive({ version: 'v3', auth });
//   } catch (error) {
//     console.error("Gagal inisialisasi Google Drive Service:", error);
//     throw new Error("Internal Server Error: Drive Auth Failed");
//   }
// }

async function getDriveService() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' 
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

// export async function uploadToDrive(formData: FormData, programId: number, category: string) {
//   const file = formData.get('file') as File;
//   const drive = await getDriveService();

//   try {
//     const drive = await getDriveService();
//     const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

//     // Tambahkan pengecekan ini untuk memastikan Folder ID valid
//     try {
//       const folderCheck = await drive.files.get({
//         fileId: folderId,
//         fields: 'name'
//       });
//       console.log("Folder ditemukan! Nama folder:", folderCheck.data.name);
//     } catch (err: any) {
//       console.error("DEBUG: Folder tidak ditemukan atau tidak ada akses!");
//       return { data: null, error: `Folder ID salah atau tidak ada akses: ${err.message}` };
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const fileMetadata = {
//       name: file.name,
//       parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
//     };

//     const media = {
//       mimeType: file.type,
//       body: Readable.from(buffer),
//     };

//     const gdriveResponse = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: 'id, webViewLink, webContentLink',
//     });

//     const { id, webViewLink, webContentLink } = gdriveResponse.data;

//     // 2. Simpan Link ke Supabase
//     const { data, error } = await supabase.from('File').insert({
//       program_id: programId,
//       gdrive_id: id,
//       view_link: webViewLink,
//       download_link: webContentLink,
//       category: category,
//       status: 'active',
//       name: file.name
//     }).select().single();
//   } catch (error: any) {
//     return { data: null, error: error.message };
//   }
// }


export async function uploadToDrive(formData: FormData, programId: string, category: string) {
  try {
    const file = formData.get('file') as File;
    const drive = await getDriveService();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // DEBUG: Cek di terminal VS Code apakah ID ini muncul
    console.log("Memulai upload ke Folder ID:", folderId);

    if (!folderId) throw new Error("GOOGLE_DRIVE_FOLDER_ID tidak ditemukan di .env");

    const buffer = Buffer.from(await file.arrayBuffer());
    const mediaStream = Readable.from(buffer);

    const fileMetadata = {
      name: file.name,
      parents: [folderId], // Pastikan ini adalah array
    };

    const media = {
      mimeType: file.type,
      body: mediaStream,
    };

    const gdriveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const { id: gFileId, webViewLink, webContentLink } = gdriveResponse.data;

    // Simpan ke Supabase (Gunakan 'await' karena programId dikirim dari params)
    const { data, error: sbError } = await supabase.from('File').insert({
      program_id: programId,
      gdrive_id: gFileId,
      view_link: webViewLink,
      download_link: webContentLink,
      category: category,
      name: file.name,
      status: 'active'
    }).select().single();

    if (sbError) throw sbError;

    return { success: true, data };

  } catch (error: any) {
    console.error("Kesalahan Upload:", error.message);
    return { success: false, error: error.message };
  }
}
export async function deleteFile(fileId: number, gdriveId: string) {
  const drive = await getDriveService();

  // 1. Hapus dari Google Drive
  try {
    await drive.files.delete({ fileId: gdriveId });
  } catch (err) {
    console.error("Gagal hapus di Drive (mungkin sudah terhapus)", err);
  }

  // 2. Hapus dari Supabase
  const { error } = await supabase.from('File').delete().eq('id', fileId);

  if (error) throw error;
  return { success: true };
}