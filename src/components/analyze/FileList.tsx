import FileListItem from "./FileListItem";

export default function FileList() {
  return (
    <>
      <ul className="block border-line-light rounded-[12px] border max-w-[247px] text-gray-dark">
        FileList
        <FileListItem />
        <FileListItem />
        <FileListItem />
        <FileListItem />
      </ul>
    </>
  );
}
