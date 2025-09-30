import type { FC, ReactNode } from "react";

type Props = {
  children?: ReactNode
}

export const MainLayout: FC<Props> = function() {
    return <>
      <h1>Je suis la navbar</h1>
    </>;
};






//Mise à jour de l'architecture - configuration installation de tailwind css ainsi 