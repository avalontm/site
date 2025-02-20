const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <img 
        src="/assets/svg/vinyl.svg" 
        alt="Cargando..." 
        className="size-6 animate-spin" 
      />
    </div>
  );
};

export default Loading;
