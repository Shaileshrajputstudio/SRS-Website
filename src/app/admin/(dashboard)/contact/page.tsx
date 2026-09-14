import { getStudioContactInfo } from "@/data/studioInfo";
import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const info = await getStudioContactInfo();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold text-gray-900">Contact Info</h1>
      <ContactForm info={info} />
    </div>
  );
}
