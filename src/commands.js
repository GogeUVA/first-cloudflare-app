export const TEST_COMMAND = {
  name: 'test',
  description: 'Replies with hello world',
};

export const CREATE_NOTE_COMMAND = {
  name: 'create',
  description: 'Create a note',
  options: [
    {
      name: 'title',
      description: 'Title',
      type: 3,
      required: true,
    },
    {
      name: 'content',
      description: 'Content',
      type: 3,
      required: true,
    },
  ],
};

export const LIST_NOTES_COMMAND = {
  name: 'list',
  description: 'List your notes',
};

export const UPDATE_NOTE_COMMAND = {
  name: 'update',
  description: 'Update a note',
  options: [
    {
      name: 'id',
      description: 'Note ID',
      type: 4,
      required: true,
    },
    {
      name: 'content',
      description: 'New content',
      type: 3,
      required: true,
    },
  ],
};

export const DELETE_NOTE_COMMAND = {
  name: 'delete',
  description: 'Delete a note',
  options: [
    {
      name: 'id',
      description: 'Note ID',
      type: 4,
      required: true,
    },
  ],
};