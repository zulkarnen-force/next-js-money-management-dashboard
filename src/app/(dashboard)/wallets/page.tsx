"use client"
import CreditCard from "@/components/credit-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";

const WalletPage = () => {
   const [activeCard, setActiveCard] = useState("card1");

   const cards = [
     {
       id: "card1",
       name: "ALEX MORGAN",
       number: "5412 7534 8901 2345",
       expiry: "09/26",
       variant: "dark" as const,
       title: "Primary Card",
       description: "Your everyday spending card",
     },
     {
       id: "card2",
       name: "SARAH JOHNSON",
       number: "4111 2222 3333 4444",
       expiry: "05/28",
       variant: "light" as const,
       title: "Savings Card",
       description: "For your savings and investments",
     },
     {
       id: "card3",
       name: "JAMES WILSON",
       number: "3782 822463 10005",
       expiry: "12/24",
       variant: "gradient" as const,
       title: "Premium Card",
       description: "Exclusive benefits and rewards",
     },
     {
       id: "card4",
       name: "EMMA THOMPSON",
       number: "6011 0009 9013 9424",
       expiry: "03/27",
       className: "bg-rose-600",
       title: "Travel Card",
       description: "No foreign transaction fees",
     },
   ];

   return (
     <div className="space-y-8">
       <h1 className="text-2xl font-bold mb-6">My Credit Cards</h1>

       <div className="mb-8">
         <p className="text-muted-foreground mb-4">
           Click on any card to copy its details to clipboard
         </p>

         <Tabs
           defaultValue="card1"
           value={activeCard}
           onValueChange={setActiveCard}
         >
           <TabsList className="grid grid-cols-4 mb-6">
             {cards.map((card) => (
               <TabsTrigger key={card.id} value={card.id}>
                 {card.title.split(" ")[0]}
               </TabsTrigger>
             ))}
           </TabsList>

           {cards.map((card) => (
             <TabsContent key={card.id} value={card.id} className="mt-0">
               <Card>
                 <CardHeader>
                   <CardTitle>{card.title}</CardTitle>
                   <CardDescription>{card.description}</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <CreditCard
                     name={card.name}
                     number={card.number}
                     expiry={card.expiry}
                     variant={card.variant as any}
                     className={card.className}
                   />
                   <p className="mt-4 text-sm text-muted-foreground">
                     Click on the card to copy card details to clipboard
                   </p>
                 </CardContent>
               </Card>
             </TabsContent>
           ))}
         </Tabs>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {cards.map((card) => (
           <div
             key={card.id}
             className="transition-all duration-300 transform hover:scale-105"
           >
             <CreditCard
               name={card.name}
               number={card.number}
               expiry={card.expiry}
               variant={card.variant as any}
               className={card.className}
             />
           </div>
         ))}
       </div>
     </div>
   );
};

export default WalletPage;
