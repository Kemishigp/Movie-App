const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your Appwrite Endpoint
    .setProject(PROJECT_ID); // Your project ID

const databases = new Databases(client); 

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await databases.listDocuments( 
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal('searchTerm', searchTerm)]
        ); 
        // Check if a document with the searchTerm already exists
        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await databases.updateDocument( 
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1,
                }
            );
        } else {
            // Create a new document if the searchTerm is not found
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}` // Corrected: template literal for URL
                }
            );
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
};

export const getTrendingMovies   = async () => {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.orderDesc('count'), Query.limit(5) ]
        );
        console.log('Search counts fetched:', result);
        return result.documents;
    } catch (error) {
        console.error('Error fetching search counts:', error);
        return [];
    }
};

// console.log('Appwrite Config:', { PROJECT_ID, DATABASE_ID, COLLECTION_ID });