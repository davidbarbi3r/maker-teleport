import Image from "next/image";

export default function DaiIcon(
  { width }:
  { width: number }
): React.ReactElement {
  return <Image src="/images/dai-logo.png" width={width} height={width} alt="DAI logo" />;
}
