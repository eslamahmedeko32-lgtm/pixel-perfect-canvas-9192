import claddingA from "@/assets/materials-cladding-a.jpg";
import claddingB from "@/assets/materials-cladding-b.jpg";
import signageA from "@/assets/materials-signage-a.jpg";
import signageB from "@/assets/materials-signage-b.jpg";

const SHOWCASE_IMAGES = [
  { src: claddingA, alt: "واجهة محل بكسوة معدنية فاخرة" },
  { src: signageA, alt: "حروف بارزة مضيئة لواجهة تجارية" },
  { src: claddingB, alt: "تفاصيل كلادنج حديثة للواجهات" },
  { src: signageB, alt: "نماذج نيون وأكريليك ولوحات مضيئة" },
];

export default function FacadeShowcase() {
  const movingImages = [...SHOWCASE_IMAGES, ...SHOWCASE_IMAGES];

  return (
    <div
      className="facade-showcase mt-7 w-full max-w-5xl overflow-hidden"
      aria-label="معرض متحرك لأفكار الواجهات واللوحات الإعلانية"
    >
      <div className="facade-showcase-track" dir="ltr">
        {movingImages.map((image, index) => (
          <figure
            key={`${image.src}-${index}`}
            className="facade-showcase-slide"
            aria-hidden={index >= SHOWCASE_IMAGES.length}
          >
            <img src={image.src} alt={index < SHOWCASE_IMAGES.length ? image.alt : ""} />
          </figure>
        ))}
      </div>
    </div>
  );
}