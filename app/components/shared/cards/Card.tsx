'use client';

interface ICard {
   isShadowed?: boolean;
   children: React.ReactNode;
   className?: string;
}

export default function Card({ isShadowed, children, className }: ICard) {
   return (
      <div
         className={`${isShadowed ? 'bg-foundation' : 'bg-white'} 
         overflow-hidden rounded-lg p-6 border-2 shadow-xl
         ${className}`}
      >
         {children}
      </div>
   );
}
