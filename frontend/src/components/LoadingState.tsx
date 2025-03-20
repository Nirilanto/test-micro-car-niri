interface LoadingStateProps {
    message?: string;
  }
  
  const LoadingState = ({ message = "Chargement de vos documents..." }: LoadingStateProps) => {
    return (
      <div className="text-center py-16 animate-in fade-in duration-500">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-6 text-lg text-muted-foreground">{message}</p>
      </div>
    );
  };
  
  export default LoadingState;