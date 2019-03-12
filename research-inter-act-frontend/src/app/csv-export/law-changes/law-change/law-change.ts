export class LawChange {
  aenderungs_id:number;
  gesetzes_id:number;
  user_id:number;
  titel_neu: string;
  gesetzestext_neu: string;
  begruendung: string;
  typ: string;
  aenderungs_bezugs_id: number;
  datum: Date;
  ip: string;
  geloescht: boolean;
  conversationRate: number;
  paragraph: string;
  sort: number;
  aenderungen_id: number[];
  kommentare_id:number[];
  ratings_id:number[];
  tags:string[];
}
