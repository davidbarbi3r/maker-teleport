type Props = {
    width?: string;
    height?: string;
    borderRadius?: string;
  };
  
  export default function LoadingPlaceholder({
    width = "200px",
    height = "20px",
    borderRadius = "4px",
  }: Props): React.ReactElement {
    return (
      <>
        <div className="loading-placeholder" />
        <style jsx>{`
          .loading-placeholder {
            width: ${width};
            height: ${height};
            border-radius: ${borderRadius};
            background: linear-gradient(
              -45deg,
              var(--accents-2),
              var(--accents-5),
              var(--accents-2),
              var(--accents-5)
            );
            background-size: 400% 400%;
            opacity: 0.4;
            animation: gradient 10s ease infinite;
          }
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      </>
    );
  }
  