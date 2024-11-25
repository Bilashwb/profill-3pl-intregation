import fs from 'fs';
import path from 'path';
export async function action({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get("artfile");
    if (!file ) {
      return {fileName:"",filePath:""};
    }
    const uploadsPath = path.resolve("./public/uploads");
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = path.join(uploadsPath, fileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
    const fileUrl = `https://profill-3pl-intregation.onrender.com/uploads/${fileName}`;
    return {fileName,fileUrl};
  } catch (error) {
    return {fileName:"",filePath:""};
  }
}
