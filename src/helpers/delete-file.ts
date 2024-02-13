import cloudinary from "@/lib/cloudinary";


export const deleteFile = async (fileId: string) => {
  
  try {
    const result = await cloudinary.uploader.destroy(fileId)

    if(result === 'not found') throw new Error('Archivo no encontrado con ese ID');

    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error al eliminar el archivo')
  }

};