const NotFound = () => {
  return (
    <div className="flex h-[calc(100vh-256px)] flex-col items-center justify-center text-center">
      <img 
        src="/not_found.png" 
        alt="Not Found" 
        className="mt-4 max-w-xs" 
      />
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-lg text-gray-300">Página no encontrada</p>
    </div>
  );
};

export default NotFound;
