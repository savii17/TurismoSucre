import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n/useLanguage";

export default function ImageUrlField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { tx } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  useEffect(() => { if (!value.trim()) { setStatus("idle"); return; } setStatus("loading"); }, [value]);
  return <div className="image-url-field"><label>{tx("Imagen (ruta o URL)")}<input type="text" maxLength={1000} value={value} onChange={(event) => onChange(event.target.value)} placeholder="/images/lugares-turisticos/imagen.jpg o https://…" /></label>
    {value.trim() && <div className="image-url-field__preview"><img src={value.trim()} alt={tx("Vista previa de imagen")} onLoad={() => setStatus("ok")} onError={() => setStatus("error")} />{status === "loading" && <small>{tx("Cargando vista previa…")}</small>}{status === "ok" && <small>{tx("Imagen disponible")}</small>}{status === "error" && <small role="alert">{tx("No se pudo cargar la imagen. Revisa la ruta o URL; puedes corregirla sin perder el formulario.")}</small>}</div>}</div>;
}
