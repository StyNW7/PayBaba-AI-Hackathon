'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Award,
  MoreVertical,
  UserPlus,
  Download,
  Users,
  Briefcase,
  Star,
  MapPin,
  ChevronDown
} from 'lucide-react';

// Dummy team data
const teamMembers = [
  {
    id: 1,
    name: 'John Smith',
    position: 'Chief Executive Officer',
    department: 'Executive',
    age: 45,
    email: 'john.smith@paybaba.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2018-03-15',
    status: 'active',
    avatar: 'JS',
    experience: '15 years',
    rating: 4.9,
    location: 'New York, USA'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    position: 'Chief Financial Officer',
    department: 'Finance',
    age: 42,
    email: 'sarah.j@paybaba.com',
    phone: '+1 (555) 234-5678',
    joinDate: '2019-06-20',
    status: 'active',
    avatar: 'SJ',
    experience: '12 years',
    rating: 4.8,
    location: 'London, UK'
  },
  {
    id: 3,
    name: 'Michael Chen',
    position: 'CTO',
    department: 'Engineering',
    age: 38,
    email: 'michael.chen@paybaba.com',
    phone: '+1 (555) 345-6789',
    joinDate: '2020-01-10',
    status: 'active',
    avatar: 'MC',
    experience: '10 years',
    rating: 4.9,
    location: 'San Francisco, USA'
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    position: 'Head of Product',
    department: 'Product',
    age: 35,
    email: 'emily.r@paybaba.com',
    phone: '+1 (555) 456-7890',
    joinDate: '2020-09-05',
    status: 'active',
    avatar: 'ER',
    experience: '8 years',
    rating: 4.7,
    location: 'Austin, USA'
  },
  {
    id: 5,
    name: 'David Kim',
    position: 'Lead Developer',
    department: 'Engineering',
    age: 32,
    email: 'david.kim@paybaba.com',
    phone: '+1 (555) 567-8901',
    joinDate: '2021-02-15',
    status: 'active',
    avatar: 'DK',
    experience: '7 years',
    rating: 4.8,
    location: 'Seattle, USA'
  },
  {
    id: 6,
    name: 'Lisa Wang',
    position: 'Marketing Director',
    department: 'Marketing',
    age: 37,
    email: 'lisa.wang@paybaba.com',
    phone: '+1 (555) 678-9012',
    joinDate: '2019-11-20',
    status: 'active',
    avatar: 'LW',
    experience: '9 years',
    rating: 4.6,
    location: 'Chicago, USA'
  },
  {
    id: 7,
    name: 'James Wilson',
    position: 'Sales Manager',
    department: 'Sales',
    age: 41,
    email: 'james.w@paybaba.com',
    phone: '+1 (555) 789-0123',
    joinDate: '2018-08-12',
    status: 'vacation',
    avatar: 'JW',
    experience: '11 years',
    rating: 4.5,
    location: 'Boston, USA'
  },
  {
    id: 8,
    name: 'Maria Garcia',
    position: 'HR Lead',
    department: 'Human Resources',
    age: 39,
    email: 'maria.g@paybaba.com',
    phone: '+1 (555) 890-1234',
    joinDate: '2020-04-18',
    status: 'active',
    avatar: 'MG',
    experience: '8 years',
    rating: 4.7,
    location: 'Miami, USA'
  },
  {
    id: 9,
    name: 'Robert Taylor',
    position: 'Operations Manager',
    department: 'Operations',
    age: 44,
    email: 'robert.t@paybaba.com',
    phone: '+1 (555) 901-2345',
    joinDate: '2019-09-30',
    status: 'active',
    avatar: 'RT',
    experience: '12 years',
    rating: 4.6,
    location: 'Denver, USA'
  },
  {
    id: 10,
    name: 'Amanda Lee',
    position: 'Customer Success Lead',
    department: 'Customer Support',
    age: 33,
    email: 'amanda.l@paybaba.com',
    phone: '+1 (555) 012-3456',
    joinDate: '2021-07-22',
    status: 'active',
    avatar: 'AL',
    experience: '6 years',
    rating: 4.9,
    location: 'Portland, USA'
  },
  {
    id: 11,
    name: 'Kevin Patel',
    position: 'Data Scientist',
    department: 'Engineering',
    age: 29,
    email: 'kevin.p@paybaba.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2022-01-10',
    status: 'active',
    avatar: 'KP',
    experience: '4 years',
    rating: 4.5,
    location: 'San Jose, USA'
  },
  {
    id: 12,
    name: 'Nina Williams',
    position: 'Product Designer',
    department: 'Product',
    age: 31,
    email: 'nina.w@paybaba.com',
    phone: '+1 (555) 234-5678',
    joinDate: '2021-11-15',
    status: 'active',
    avatar: 'NW',
    experience: '5 years',
    rating: 4.7,
    location: 'Los Angeles, USA'
  }
];

const departments = ['All', 'Executive', 'Finance', 'Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources', 'Operations', 'Customer Support'];

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'All' || member.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Sorting logic
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'age') {
      return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
    } else if (sortBy === 'rating') {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-[#10B981]';
      case 'vacation': return 'bg-[#F59E0B]';
      default: return 'bg-[#6B7280]';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Team Dashboard
          </h1>
          <p className="text-[#6B7280] mt-2">Manage your team members and their roles</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#E5E7EB] hover:border-[#F15A22] transition-all duration-300">
            <Download size={16} className="text-[#6B7280]" />
            <span className="text-sm font-medium">Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl hover:shadow-lg transition-all duration-300">
            <UserPlus size={16} />
            <span className="text-sm font-medium">Add Member</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center">
              <Users size={20} className="text-[#F15A22]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Total Members</p>
              <p className="text-xl font-bold text-[#1F2937]">{teamMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E0F7F6] rounded-lg flex items-center justify-center">
              <Briefcase size={20} className="text-[#2DAEAA]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Departments</p>
              <p className="text-xl font-bold text-[#1F2937]">{departments.length - 1}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center">
              <Star size={20} className="text-[#F15A22]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Avg Rating</p>
              <p className="text-xl font-bold text-[#1F2937]">4.7</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E0F7F6] rounded-lg flex items-center justify-center">
              <Award size={20} className="text-[#2DAEAA]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Active</p>
              <p className="text-xl font-bold text-[#1F2937]">{teamMembers.filter(m => m.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by name, position, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors"
              >
                <Filter size={18} className="text-[#6B7280]" />
                <span>Filter</span>
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-xl z-10 p-2">
                  <p className="text-xs font-semibold text-[#6B7280] px-2 py-1">Department</p>
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                        selectedDepartment === dept 
                          ? 'bg-[#F15A22] text-white' 
                          : 'hover:bg-[#F3F4F6]'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2.5 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedDepartment !== 'All') && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFF3ED] text-[#F15A22] rounded-full text-sm">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')}>×</button>
              </span>
            )}
            {selectedDepartment !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E0F7F6] text-[#2DAEAA] rounded-full text-sm">
                Dept: {selectedDepartment}
                <button onClick={() => setSelectedDepartment('All')}>×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentItems.map((member) => (
          <div
            key={member.id}
            className="group bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedMember(member)}
          >
            {/* Header with status */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {member.avatar}
                </div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={18} className="text-[#6B7280]" />
              </button>
            </div>

            {/* Member Info */}
            <div>
              <h3 className="font-bold text-[#1F2937] text-lg">{member.name}</h3>
              <p className="text-[#F15A22] text-sm font-medium">{member.position}</p>
              <p className="text-[#6B7280] text-xs mt-1">{member.department}</p>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-[#6B7280]" />
                <span className="text-[#4B5563] truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-[#6B7280]" />
                <span className="text-[#4B5563]">{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-[#6B7280]" />
                <span className="text-[#4B5563]">Age {member.age} · Joined {member.joinDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-[#6B7280]" />
                <span className="text-[#4B5563]">{member.location}</span>
              </div>
            </div>

            {/* Rating and Experience */}
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-[#F59E0B] fill-current" />
                <span className="font-semibold text-[#1F2937]">{member.rating}</span>
              </div>
              <span className="text-xs text-[#6B7280]">{member.experience}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {sortedMembers.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#E5E7EB] p-4">
          <p className="text-sm text-[#6B7280]">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedMembers.length)} of {sortedMembers.length} members
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#F15A22] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm ${
                  currentPage === i + 1
                    ? 'bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white'
                    : 'border border-[#E5E7EB] hover:border-[#F15A22]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#F15A22] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMember(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1F2937]">{selectedMember.name}</h2>
                    <p className="text-[#F15A22]">{selectedMember.position}</p>
                    <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(selectedMember.status)} mr-1`} />
                    <span className="text-sm text-[#6B7280] capitalize">{selectedMember.status}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedMember(null)} className="text-[#6B7280] hover:text-[#1F2937]">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Email</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Phone</p>
                  <p className="font-medium">{selectedMember.phone}</p>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Department</p>
                  <p className="font-medium">{selectedMember.department}</p>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Location</p>
                  <p className="font-medium">{selectedMember.location}</p>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Join Date</p>
                  <p className="font-medium">{selectedMember.joinDate}</p>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Experience</p>
                  <p className="font-medium">{selectedMember.experience}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors">
                  Message
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg hover:shadow-lg transition-all">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}