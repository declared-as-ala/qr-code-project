// Uploads a file directly from the browser to Cloudinary using a
// short-lived signature from our API. The file bytes never pass through
// our Vercel function, avoiding its request-body size limit.
export async function uploadImageDirect(file: File): Promise<string> {
  const sigRes = await fetch("/api/uploads/signature", { method: "POST" });
  if (!sigRes.ok) throw new Error("Impossible d'obtenir l'autorisation d'upload");
  const { signature, timestamp, folder, apiKey, cloudName } = await sigRes.json();

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", apiKey);
  fd.append("timestamp", String(timestamp));
  fd.append("signature", signature);
  fd.append("folder", folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: fd,
  });
  if (!uploadRes.ok) throw new Error("Échec de l'upload de l'image");
  const data = await uploadRes.json();
  return data.secure_url as string;
}
