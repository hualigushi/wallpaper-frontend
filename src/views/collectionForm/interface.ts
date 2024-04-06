export interface CollectionFormProps {
    id:string;
    title: string;
    enTitle: string;
    description: string;
}

export interface WallpaperFormProps {
    id:string;
    title: string;
    enTitle: string;
    tags: string;
    collectionId:string;
    authorId: string;
}

export interface WallpaperItemProps {
    id:string;
    title: string;
    enTitle: string;
    tags:string;
    downloadCount:string;
    createdAt:string;
    updatedAt:string;
}