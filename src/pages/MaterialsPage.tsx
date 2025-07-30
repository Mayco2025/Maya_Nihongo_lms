import React, { useState, useEffect } from 'react';
import { PlusCircle, Lock } from '../components/icons';
import { Material, ClassGroup } from '../types';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { getAppId } from '../utils/firebase';

interface MaterialsPageProps {
  db: any;
  isTeacherMode?: boolean;
  userClassGroups?: string[];
  classGroups?: ClassGroup[];
}

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <p className="font-bold text-lg text-slate-800">{material.lessonName}</p>
        <p className="text-slate-500 text-sm">
          Class Group: {material.classGroup}
        </p>
        {material.description && (
          <p className="text-slate-600 text-sm mt-1">{material.description}</p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {material.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 sm:mt-0">
        <a 
          href={material.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-rose-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-rose-600 transition-colors shadow-sm hover:shadow-md"
        >
          Download {material.fileType.toUpperCase()}
        </a>
      </div>
    </div>
  );
};

const MaterialsPage: React.FC<MaterialsPageProps> = ({ 
  db, 
  isTeacherMode = false, 
  userClassGroups = [], 
  classGroups = [] 
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassGroup, setSelectedClassGroup] = useState<string>('all');

  useEffect(() => {
    if (!db) return;
    
    setLoading(true);
    const appId = getAppId();
    const materialsRef = collection(db, `artifacts/${appId}/public/data/materials`);
    const q = query(materialsRef);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const materialList: Material[] = [];
      querySnapshot.forEach((doc) => {
        materialList.push({ id: doc.id, ...doc.data() } as Material);
      });
      setMaterials(materialList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching materials: ", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [db]);
  
  // Filter materials based on selected class group and user access
  const filteredMaterials = materials.filter(material => {
    // If "all" is selected, show materials user has access to
    if (selectedClassGroup === 'all') {
      return material.accessLevel === 'public' || 
             material.accessLevel === 'students-only' ||
             (material.accessLevel === 'class-specific' && 
              material.allowedClasses?.some(className => userClassGroups.includes(className)));
    }
    
    // If specific class group is selected, show only materials for that group
    return material.classGroup === selectedClassGroup ||
           (material.accessLevel === 'class-specific' && 
            material.allowedClasses?.includes(selectedClassGroup));
  });

  if (loading) {
    return <div className="text-center p-8 text-slate-500">Loading materials...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Course Materials</h2>
        {isTeacherMode && (
          <button className="flex items-center bg-rose-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Material
          </button>
        )}
      </div>

      {/* Class Group Filter */}
      {classGroups.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Class Group:
          </label>
          <select
            value={selectedClassGroup}
            onChange={(e) => setSelectedClassGroup(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="all">All Available Materials</option>
            {classGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.type === 'ethiopian' ? 'Ethiopian' : group.type === 'japanese' ? 'Japanese' : 'Private'})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-4">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map(m => <MaterialCard key={m.id} material={m} />)
        ) : (
          <p className="text-slate-500 bg-white/80 p-4 rounded-lg">
            {selectedClassGroup === 'all' 
              ? 'No materials available yet.' 
              : `No materials available for the selected class group.`
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage; 