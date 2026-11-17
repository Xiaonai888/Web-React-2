import ReaderProfilePhotoLibraryPage from '../ReaderProfiles/ReaderProfilePhotoLibraryPage'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'

export default function AuthorProfilePhotoLibraryPage() {
  useAuthorPageFooterVisibility(false)
  return <ReaderProfilePhotoLibraryPage mode="author" />
}
