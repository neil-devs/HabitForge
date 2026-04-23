import React, { useState } from 'react';
import { useFriends } from '../../hooks/useFriends';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Users, Search, UserPlus, UserCheck, UserX, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

const FriendsPage = () => {
  const { 
    acceptedFriends, pendingIncoming, pendingOutgoing, 
    isLoading, sendRequest, respondRequest, removeFriend 
  } = useFriends();

  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['users', 'search', searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 3) return [];
      const res = await api.get(`/users/search?q=${searchQuery}`);
      return res.data.data;
    },
    enabled: searchQuery.length >= 3
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="text-accent-blue" />
          Friends
        </h1>
        <p className="text-text-secondary mt-1">
          Connect with others and compete on the Leaderboard.
        </p>
      </div>

      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search users by username or display name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-tertiary border border-border-subtle rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          />
        </div>

        {searchQuery.length >= 3 && (
          <div className="mt-4 space-y-3">
            {isSearching ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : searchResults.length === 0 ? (
              <div className="text-center p-4 text-text-muted">No users found.</div>
            ) : (
              searchResults.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border-subtle">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar_url} fallback={user.username} />
                    <div>
                      <p className="font-bold">{user.display_name || user.username}</p>
                      <p className="text-xs text-text-muted">Level {user.level}</p>
                    </div>
                  </div>
                  {user.friend_status === 'accepted' ? (
                    <Button variant="ghost" size="sm" disabled className="text-accent-emerald">
                      <UserCheck size={16} className="mr-2"/> Friends
                    </Button>
                  ) : user.friend_status === 'pending' ? (
                    <Button variant="ghost" size="sm" disabled className="text-accent-amber">
                      <Clock size={16} className="mr-2"/> Pending
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => sendRequest.mutate(user.id)}>
                      <UserPlus size={16} className="mr-2"/> Add Friend
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Friend Requests {pendingIncoming.length > 0 && <span className="bg-accent-rose text-white text-xs px-2 py-0.5 rounded-full">{pendingIncoming.length}</span>}
          </h2>
          {isLoading ? (
             <Skeleton className="h-24 rounded-2xl" />
          ) : pendingIncoming.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-border-subtle rounded-2xl text-text-muted">
              No pending requests.
            </div>
          ) : (
            pendingIncoming.map(req => (
               <Card key={req.id} className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Avatar src={req.friend.avatar_url} fallback={req.friend.username} />
                    <div>
                      <p className="font-bold">{req.friend.display_name || req.friend.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => respondRequest.mutate({ requestId: req.id, action: 'accept' })} className="p-2 bg-accent-emerald/10 text-accent-emerald hover:bg-accent-emerald/20 rounded-lg">
                      <UserCheck size={18} />
                    </button>
                    <button onClick={() => respondRequest.mutate({ requestId: req.id, action: 'reject' })} className="p-2 bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20 rounded-lg">
                      <UserX size={18} />
                    </button>
                  </div>
               </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">My Friends</h2>
          {isLoading ? (
             <Skeleton className="h-24 rounded-2xl" />
          ) : acceptedFriends.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-border-subtle rounded-2xl text-text-muted">
              You haven't added any friends yet. Search above to find them!
            </div>
          ) : (
            acceptedFriends.map(friend => (
               <Card key={friend.id} className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Avatar src={friend.friend.avatar_url} fallback={friend.friend.username} />
                    <div>
                      <p className="font-bold">{friend.friend.display_name || friend.friend.username}</p>
                      <p className="text-xs text-text-muted">Level {friend.friend.level}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFriend.mutate(friend.friend.id)} className="p-2 text-text-muted hover:text-accent-rose rounded-lg transition-colors">
                    <UserX size={18} />
                  </button>
               </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
