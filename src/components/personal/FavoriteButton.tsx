import { useEffect, useState } from "react";
import { authRepository } from "../../repositories/authRepository";
import { FAVORITES_CHANGED_EVENT, personalRepository } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";

export default function FavoriteButton({ kind, id, name, category, to }: { kind: string; id: string; name: string; category?: string; to: string }) {
  const { tx } = useLanguage();
  const isSaved = () => authRepository.isRole("USUARIO") && personalRepository.listFavorites().some((item) => item.kind === kind && item.id === id);
  const [saved, setSaved] = useState(isSaved);
  useEffect(() => {
    const sync = () => setSaved(isSaved());
    window.addEventListener(FAVORITES_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    sync();
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [kind, id]);
  if (!authRepository.isRole("USUARIO")) return null;
  return <button className="favorite-toggle" type="button" aria-pressed={saved} onClick={() => setSaved(personalRepository.toggleFavorite({ kind, id, name, category, to }))}>{saved ? "♥" : "♡"} {tx(saved ? "Guardado" : "Guardar en favoritos")}</button>;
}
