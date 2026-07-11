import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Fish', value: 'Fish'},
          {title: 'Bird', value: 'Bird'},
          {title: 'Box (Aquariums)', value: 'Box'},
          {title: 'Leaf (Plants)', value: 'Leaf'},
          {title: 'Wrench (Accessories)', value: 'Wrench'},
          {title: 'Bone (Pet Food)', value: 'Bone'},
        ],
      },
    }),
    defineField({
      name: 'accent',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color e.g. #4FC3F7',
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description', media: 'image'},
  },
})
