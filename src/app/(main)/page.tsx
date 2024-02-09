import { initialProfile } from '@/lib/initial-profile';

export default async function Home() {

  const user = await initialProfile()

  return (
    <div className="text-indigo-600 text-lg">
      Pagina de inicio
      <p>{user.name}</p>
    </div>
  );
}
