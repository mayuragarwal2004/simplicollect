// import React, { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
// import { axiosInstance } from '../../../utils/config';
// import { toast } from 'react-toastify';
// import { Plus, Loader2 } from 'lucide-react';

// const MemberSearch = ({ onMemberAdd, chapterId }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [suggestedMembers, setSuggestedMembers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setSuggestedMembers([]);
//       setShowDropdown(false);
//       return;
//     }

//     const delayDebounceFn = setTimeout(() => {
//       fetchMembers();
//     }, 300);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery]);

//   const fetchMembers = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(`/api/members/search`, {
//         params: { 
//           query: searchQuery,
//           chapterId: chapterId // Changed from organizationId to chapterId
//         }
//       });
//       setSuggestedMembers(res.data);
//       setShowDropdown(res.data.length > 0);
//     } catch (error) {
//       toast.error('Error fetching members');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddMember = async (member) => {
//     try {
//       await axiosInstance.post('/api/admin/members/add', { 
//         memberId: member.id,
//         chapterId: chapterId // Changed from organizationId to chapterId
//       });
//       toast.success('Member added successfully');
//       onMemberAdd(member);
//       setSearchQuery('');
//       setShowDropdown(false);
//     } catch (error) {
//       toast.error('Failed to add member');
//       console.error(error);
//     }
//   };

//   const getAvatarFallback = (name) => {
//     return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
//   };

//   return (
//     <Popover open={showDropdown} onOpenChange={setShowDropdown}>
//       <PopoverTrigger asChild>
//         <Input
//           type="text"
//           placeholder="Search and add members..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full"
//         />
//       </PopoverTrigger>
//       <PopoverContent className="w-[300px] p-0" align="start">
//         <Command>
//           <CommandList>
//             {loading ? (
//               <CommandEmpty className="flex justify-center items-center p-4">
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Loading members...
//               </CommandEmpty>
//             ) : suggestedMembers.length === 0 ? (
//               <CommandEmpty>No members found</CommandEmpty>
//             ) : (
//               <CommandGroup>
//                 {suggestedMembers.map((member) => (
//                   <CommandItem 
//                     key={member.id} 
//                     value={member.name}
//                     onSelect={() => handleAddMember(member)}
//                     className="flex items-center justify-between cursor-pointer"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src={member.avatar} alt={member.name} />
//                         <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <div className="text-sm font-medium">{member.name}</div>
//                         <div className="text-xs text-muted-foreground">{member.email}</div>
//                       </div>
//                     </div>
//                     <Button 
//                       variant="outline" 
//                       size="sm" 
//                       className="ml-2"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAddMember(member);
//                       }}
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             )}
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default MemberSearch;