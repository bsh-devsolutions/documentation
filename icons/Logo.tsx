import Image from "next/image";

export const LogoText = () => (
    <span style={{marginLeft: '.4em', fontWeight: 600}}>
        BSH Solutions
    </span>
);

interface LogoIconProps {
    width?: number;
    height?: number;
}

export const LogoIcon = ({ width = 32, height = 24.49 }: LogoIconProps) => (
    <Image
        fetchPriority="high"
        src="/logo/logo.svg"
        alt="@logo"
        width={width}
        height={height}
        style={{height: 'auto'}}
    />
);

export const Logo = () => (
    <>
        <LogoIcon />
        <LogoText />
    </>
);