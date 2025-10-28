export default function Card({ 
  children, 
  className = '',
  hover = false,
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any;
}) {
  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${
        hover ? 'hover:border-indigo-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
