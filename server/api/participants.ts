// server/api/participants.ts
interface Participant {
  id: string;
  name: string;
}

export default defineEventHandler(async () => {
  try {
    const response = await $fetch<{ items: any[] }>('https://federated-catalog.dataspace.fun/participants');
    
    const participants = response.items.map(item => {
      try {
        const selfDescription = JSON.parse(item.selfDescription);
        const credentialSubject = selfDescription.verifiableCredential?.[0]?.credentialSubject;
        
        if (credentialSubject && credentialSubject.id && credentialSubject['gx:legalName']) {
          // Use a clean version of the ID for the folder name
          const id = credentialSubject.id.includes(':') 
            ? credentialSubject.id.split(':').pop() 
            : credentialSubject.id;
            
          return {
            id: id,
            name: credentialSubject['gx:legalName']
          };
        }
      } catch (e) {
        console.error('Error parsing selfDescription for item:', item.id, e);
      }
      return null;
    }).filter((p): p is Participant => p !== null);

    return participants;

  } catch (error) {
    console.error('Failed to fetch participants:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch participants'
    });
  }
}); 