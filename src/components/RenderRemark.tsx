export default function RenderRemark({
  content,
  imgs,
}: {
  content?: string;
  imgs?: string[];
}) {  
  if (!content && imgs && imgs.length === 0) {
    return null;
  }
  return (
    <div className="text-sm my-3">
      {content ? <div className="mb-2">{content}</div> : null}
      {imgs && imgs.length ? (
        imgs.map((img,index) => (
          <img key={index} className="max-w-[300px]" src={img} />
        ))
      ) : null}
    </div>
  );
}
