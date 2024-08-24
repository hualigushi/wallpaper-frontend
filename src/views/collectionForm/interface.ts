export interface CollectionFormProps {
    id: string;
    title: string;
    enTitle: string;
    description: string;
}

export interface WallpaperFormProps {
    id: string;
    title: string;
    enTitle: string;
    tags: string;
    collectionId: string;
    authorId: string;
    uiType: string;
    uiColor: string;
}

export interface WallpaperItemProps extends WallpaperFormProps {
    downloadCount: string;
    createdAt: string;
    updatedAt: string;
}