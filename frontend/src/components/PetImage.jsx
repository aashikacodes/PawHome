// Shows the pet photo. If there is no photo (or it fails to load), shows an emoji instead.
// This component is reused in the card, the details page and the dashboard.
import { useState } from "react";

const emojis = { Dog: "🐶", Cat: "🐱", Rabbit: "🐰", Bird: "🐦", Other: "🐾" };

function PetImage({ image, species, name, className }) {
  const [failed, setFailed] = useState(false); // becomes true if the image link is broken

  if (!image || failed) {
    return <div className={`pet-placeholder ${className || ""}`}>{emojis[species] || "🐾"}</div>;
  }

  return <img src={image} alt={name} className={className} onError={() => setFailed(true)} />;
}

export default PetImage;
