import React, { useState } from 'react';
import { useJournal } from '../../hooks/useJournal';
import { BookOpen, Plus, Save, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useUiStore } from '../../store/uiStore';
import { format } from 'date-fns';

const JournalPage = () => {
  const { notes, isLoading, createNote, deleteNote } = useJournal();
  const { showConfirm } = useUiStore();
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!content.trim()) return;
    createNote.mutate({ 
      title: format(new Date(), 'EEEE, MMMM do, yyyy'),
      content,
      tags: []
    });
    setContent('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="text-accent-amber" />
          Journal
        </h1>
        <p className="text-text-secondary mt-1">
          Document your journey, reflect on your habits, and jot down ideas.
        </p>
      </div>

      <Card className="p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-amber" />
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full h-32 bg-transparent resize-none focus:outline-none text-lg text-text-primary placeholder:text-text-muted/50"
        />
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border-subtle">
          <span className="text-sm text-text-muted">{format(new Date(), 'MMMM do, yyyy')}</span>
          <Button onClick={handleSave} disabled={!content.trim() || createNote.isPending} className="gap-2">
            <Save size={16} /> Save Entry
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Past Entries</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : notes.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border-subtle rounded-2xl text-text-muted">
            Your journal is empty. Write your first entry above!
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-subtle before:to-transparent">
            {notes.map((note, index) => (
              <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-bg-primary bg-bg-secondary text-text-muted group-hover:text-accent-amber group-hover:bg-accent-amber/10 transition-colors shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <BookOpen size={16} />
                </div>
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 group-hover:border-accent-amber/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-accent-amber">{note.title || format(new Date(note.created_at), 'MMM do, yyyy')}</h3>
                    <button 
                      onClick={() => { 
                        showConfirm({
                          title: 'Delete Entry?',
                          message: 'Are you sure you want to delete this journal entry?',
                          confirmText: 'Delete',
                          cancelText: 'Cancel',
                          onConfirm: () => deleteNote.mutate(note.id)
                        });
                      }}
                      className="text-text-muted hover:text-accent-rose transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-text-secondary whitespace-pre-wrap">{note.content}</p>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
