export class Law {
  gesetzes_id: number;
  gesetz: string;
  paragraph: string;
  titel: string;
  gesetzestext: string;
  erklaerung: string;
  bgbl: string;
  frei: boolean;
  originaltext: boolean;
  datum: Date;
  user_id: number;
  ip: string;
  sort: number;
  conversationRate: number;
  ratingsRate: number;
  aenderungen_id: number[];
  kommentare_id:number[];
  ratings_id:number[];
  tags:string[];

}
