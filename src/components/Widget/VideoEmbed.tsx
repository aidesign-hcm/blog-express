import { Node, mergeAttributes } from '@tiptap/core'

// Define the custom video node
const VideoEmbed = Node.create({
  name: 'videoEmbed',

  inline: true,

  group: 'inline',

  selectable: false,

  // Define the schema for the video embed
  addAttributes() {
    return {
      src: {
        default: '',
      },
      width: {
        default: '100%',
      },
      height: {
        default: '300px',
      },
    }
  },

  // Render the node in HTML
  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes),
      0,
    ]
  },

  // Parse the videoEmbed element from the editor content
  parseHTML() {
    return [
      {
        tag: 'iframe[src]',
      },
    ]
  },

  // Add the node to the editor schema
  addCommands() {
    return {
      setVideoEmbed: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})

export default VideoEmbed
