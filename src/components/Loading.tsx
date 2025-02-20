const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <img 
        src="/assets/svg/vinyl.svg" 
        alt="Cargando..." 
        className="size-12 animate-spin" 
      />
    </div>
  );
};

export default Loading;
