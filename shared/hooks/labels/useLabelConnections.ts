// import { useAuthContext } from "@shared/hooks/context/useAuthContext";
// import { useLabels } from "./useLabels";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "@shared/api/config";
// import { LabelConnection, LabelInterface } from "@/data/Utils/interfaces";
// import { useEffect, useState } from "react";

// const LABEL_CONNECTIONS_COLLECTION = "labelConnections";

// // Hook do pobierania połączeń etykiet w stylu React Query
// export const useLabelConnections = () => {
//   const { user } = useAuthContext();
//   const { data: labels = [] } = useLabels();
//   const [connections, setConnections] = useState<Map<string, Map<string, LabelInterface[]>>>(new Map());

//   useEffect(() => {
//     if (!user || labels.length === 0) {
//       setConnections(new Map());
//       return;
//     }

//     const q = query(collection(db, LABEL_CONNECTIONS_COLLECTION), where("userId", "==", user.id));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const labelMap = new Map(labels.map((l) => [l.id, l]));
//       const newMap = new Map<string, Map<string, LabelInterface[]>>();

//       snapshot.docs.forEach((doc) => {
//         const data = doc.data() as LabelConnection;
//         const label = labelMap.get(data.labelId);
//         if (!label) return;

//         const typeMap = newMap.get(data.objectType) || new Map();
//         const existing = typeMap.get(data.objectId) || [];
//         typeMap.set(data.objectId, [...existing, label]);
//         newMap.set(data.objectType, typeMap);
//       });

//       setConnections(newMap);
//     });

//     return () => unsubscribe();
//   }, [user, labels]);

//   return connections;
// };
