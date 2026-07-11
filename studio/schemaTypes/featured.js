import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'featured',
  title: 'Homepage Featured',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'subtitle', media: 'image'},
  },
})
