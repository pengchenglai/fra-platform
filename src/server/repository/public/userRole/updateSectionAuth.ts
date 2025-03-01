import { Objects } from '@utils/objects'

import { CollaboratorProps, CollaboratorSectionsProp, RoleName, UserRole } from '@meta/user'

import { BaseProtocol, DB } from '@server/db'

export const updateSectionAuth = async (
  props: {
    id: string
    sections: CollaboratorSectionsProp
  },
  client: BaseProtocol = DB
): Promise<UserRole<RoleName, CollaboratorProps>> => {
  const { id, sections } = props

  return client
    .one<UserRole<RoleName, CollaboratorProps>>(
      `
        update users_role
        set props = props || jsonb_build_object('sections', $1::jsonb)
        where id = $2
        returning *;
    `,
      [JSON.stringify(sections), id]
    )
    .then((data) => ({
      ...Objects.camelize(data),
      props: { ...Objects.camelize(props), sections: (props as CollaboratorProps).sections },
    }))
}
