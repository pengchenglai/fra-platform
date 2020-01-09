export const classNames = {
  table: 'fra-table',
  th: 'fra-table__header-cell',
  td: 'fra-table__cell-left',
};

  // Simple sort function.
export const sortVersions = versions => {
  // TODO: If pending, show first

  // Make copy of versions (don't mutate original)
  return [...versions].sort((a, b) => {
    // TODO: Do normal comparasion first ?
    if (a.status == 'pending' && b.status !== 'pending') {
      return 1;
    }
    else if (b.status == 'pending') {
      return -1;
    }
    if (a.version == b.version) {
      return a.timestamp > b.timestamp ? -1 : 1;
    }
    return a.version > b.version ? -1 : 1;
  });
}
