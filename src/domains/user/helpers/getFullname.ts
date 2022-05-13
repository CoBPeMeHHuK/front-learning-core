export default function getFullname(firstName?: string, lastName?: string, _middleName?: string): string {
  if (firstName) {
    if (lastName) {
      return `${firstName} ${lastName}`;
    }

    return firstName;
  }

  return '';
}
