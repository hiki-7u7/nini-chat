import cloudinary from "@/lib/cloudinary";
import { v4 as uuid } from 'uuid';

export const uploadFile = async (file: File) => {

  if(!file){
    throw new Error('Archivo no encontrado')
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: 'nini-chat',
        public_id: uuid(),
      }, (err, result) => {
        if(err) {
          reject(err);
        }
        resolve(result);
      }).end(buffer);
    });
    
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error al subir archivo')
  }

}