import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'fish',
  title: 'Collection Item',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (R) => R.required()}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Fish', value: 'Fish'},
          {title: 'Birds', value: 'Birds'},
          {title: 'Aquariums', value: 'Aquariums'},
          {title: 'Live Plants', value: 'Live Plants'},
          {title: 'Accessories', value: 'Accessories'},
          {title: 'Pet Food', value: 'Pet Food'},
        ],
      },
      initialValue: 'Fish',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      validation: (R) => R.min(0),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'image'},
  },
})
