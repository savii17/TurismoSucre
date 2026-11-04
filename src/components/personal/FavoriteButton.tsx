import { useState } from "react";
import { authRepository } from "../../repositories/authRepository";
import { personalRepository } from "../../repositories/personalRepository";
import { useLanguage } from "../../i18n/useLanguage";

export default function FavoriteButton({ kind, id, name, to }: { kind: string; id: string; name: string; to: string }) {
  const { tx } = useLanguage();
  const [saved, setSaved] = useState(() => authRepository.isRole("USUARIO") && personalRepository.listFavorites().some((item) => item.kind === kind && item.id === id));
  if (!authRepository.isRole("USUARIO")) return null;
  return <button className="favorite-toggle" type="button" aria-pressed={saved} onClick={() => setSaved(personalRepository.toggleFavorite({ kind, id, name, to }))}>{saved ? "♥" : "♡"} {tx(saved ? "Guardado" : "Guardar en favoritos")}</button>;
}
