export interface IFacebookUser {
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    }
  };
  id: string;
}