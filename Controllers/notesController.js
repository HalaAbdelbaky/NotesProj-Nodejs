const Note = require('../models/Note')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean()
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' })
  }

  const notesWithUser = await Promise.all(notes.map(async (note) => {
    const user = await User.findById(note.user).lean().exec()
    return { ...note, username: user.username }
  }))
  res.json(notesWithUser)
})

const getNotesOfUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const notes = await Note.find({ user: user._id });
    const noteRows = notes.map(note => `
  <tr>
    <td>Open</td>
    <td>${note.title}</td>
    <td>${note.createdAt}</td>
    <td>${note.updatedAt}</td>
    <td>${req.user}</td>
    <td><a href="/userProfile/notes/new">Add</a></td>
    <td><a href=/userProfile/notes/edit/${note._id}>Edit</a></td>
  </tr>
`).join('');

res.render('viewNote', { noteRows ,user});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving notes');
  }
});
  

// const getNotesById = asyncHandler(async (req, res) => {
//   const _id = req.params.id;
//   console.log(_id)
//   const user = await Notes.findOne({ _id , user : req._id}).exec();
//   if (!user) {
//     return res.status(404).send("Unable to find user");
//   }
//   console.log(user)
//   res.render('userProfile', { user });

// })


const createNewNote = asyncHandler(async (req, res) => {
  const {title, text } = req.body
  const user= req.id
  // console.log(user)
  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
  if (duplicate !== null) {
    return res.status(409).json({ message: 'Duplicate note title' })
  }

  const noteObject = { user, title, text }
  const newNote = await Note.create(noteObject)

  // console.log(newNote)

  if (newNote) { // Created
    res.redirect("/userProfile/"+req.id)
  } else {
    return res.status(400).json({ message: 'Invalid note data received' })
  }
})

const editeNote = async(req,res)=>{
  try{
      // const task = await Task.findById(req.params.id)
      const _id = req.params.id
      const note = await Note.findOne({ _id , user : req.id})
      console.log(note)
      if(!note){
        return  res.status(404).send('يسطا التاسك دا مش بتاعك ')
      }
      res.render( "updateNotes",{note})
  }
  catch(e){
      res.status(500).send(e.message)
  }}
  


  const updateNote = async(req,res)=>{
    try{
      console.log(req.body._id)
        const id = req.params.id
        const note = await Note.findOneAndUpdate({ _id : id  , user : req.id},req.body,{
            new:true,
            runvalidators:true
        })
        console.log(id)
        if(!note){
            return res.status(404).send('No task')
        }
        res.status(200).send(note)
    }
    catch(e){
        res.status(500).send(e.message)
    }
}


const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Note ID required' })
  }

  const note = await Note.findById(id).exec()

  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }

  const result = await note.deleteOne()

  const reply = `Note '${result.title}' with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllNotes,
  getNotesOfUser,
  createNewNote,
  updateNote,
  editeNote,
  deleteNote
}
