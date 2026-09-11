import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { SuccessModal } from './PublishEpisodePage'
import Cropper from 'react-easy-crop'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link,
  Search,
  WandSparkles,
} from 'lucide-react'
import RichFindReplacePanel from '../../components/Author/RichFindReplacePanel'
import SmartFindReplacePanel from '../../components/Author/SmartFindReplacePanel'
import YouTubeVideoSheet from '../../components/author/YouTubeVideoSheet'
import ImageDropZone from '../../components/common/ImageDropZone'
import ScheduleReleasePicker from '../../components/author/ScheduleReleasePicker'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import MangaUploadProgressModal from '../../components/author/MangaUploadProgressModal'
import {
  deleteEpisodeLocalDraft,
  getEpisodeLocalDraftKey,
  loadEpisodeLocalDraft,
  saveEpisodeLocalDraft,
} from '../../utils/episodeLocalDraft'
import {
  MANGA_MAX_FILES_PER_PICK,
  MANGA_MAX_PAGES,
  MANGA_MIN_PUBLISH_PAGES,
  formatFileSize,
  optimizeMangaImage,
  runWithConcurrency,
  uploadMangaPageFile,
  validateMangaFile,
} from '../../utils/mangaImageUtils'

registerTranslationNamespace('episodeEditor', {
  en: {
    unsavedChanges: "Unsaved Changes",
    unsavedHelp: "This episode has unsaved edits. Save your draft or discard your changes.",
    keepEditing: "Keep Editing",
    discard: "Discard",
    saveDraft: "Save Draft",
    localDraftFound: "Local Draft Found",
    localDraftHelp: "This device has newer unsaved work for this episode. Restore it before continuing or discard the local copy.",
    discardLocal: "Discard Local",
    pleaseWait: "Please wait...",
    restoreDraft: "Restore Draft",
    cleanQuestion: "Clean paragraph spacing?",
    cleanHelp: "This will fix broken pasted lines while keeping dialogue, special lines, and paragraph breaks.",
    cancel: "Cancel",
    clean: "Clean",
    cropCover: "Crop Episode Cover",
    cropHelp: "Drag the image inside the frame. Pinch or use zoom to adjust.",
    closeCrop: "Close crop editor",
    zoom: "Zoom",
    saveCrop: "Save Crop",
    closeEpisodeDetails: "Close episode details",
    episodeDetails: "Episode Details",
    save: "Save",
    episodeTitle: "Episode Title",
    enterEpisodeTitle: "Enter episode title",
    episodeCover: "Episode Cover",
    optional: "Optional",
    coverHelp: "If empty, the story cover will be used. Recommended 16:9.",
    replace: "Replace",
    remove: "Remove",
    addEpisodeCover: "Add Episode Cover",
    crop169: "16:9 crop",
    backToPublish: "Back to publish",
    addGenre: "Add Genre",
    searchGenre: "Search Genre",
    genreHelp: "Please select the genre that best represents your story.",
    oneGenre: "Only one genre can be selected.",
    loadingGenres: "Loading genres...",
    noGenres: "No genres found.",
    addTags: "Add Tags",
    searchCustomTags: "Search & Custom Tags",
    all: "All",
    selectedCount: "Selected ({{count}}/6)",
    custom: "Custom",
    writeCustomTag: "Write your custom tag",
    add: "Add",
    noTags: "No tags found.",
    storyLanguage: "Story Language",
    done: "Done",
    closeInformation: "Close information",
    releaseOption: "Release Option",
    closeReleaseOptions: "Close release options",
    publishNow: "Publish Now",
    publishNowHelp: "Make this episode public immediately.",
    schedule: "Schedule",
    scheduleHelp: "Choose a future date and time.",
    saveAsDraft: "Save as Draft",
    saveAsDraftHelp: "Keep this episode private and finish it later.",
    chooseDateTime: "Choose date & time",
    scheduleRelease: "Schedule Release",
    ok: "OK",
    year: "Year",
    month: "Month",
    day: "Day",
    hour: "Hour",
    minute: "Minute",
    futureDateTime: "Please choose a future date and time.",
    publish: "Publish",
    untitledEpisode: "Untitled Episode",
    chooseLanguage: "Choose language",
    mainGenre: "Main Genre",
    chooseGenre: "Choose a genre",
    tags: "Tags",
    chooseTags: "Choose up to 6 tags",
    updateDays: "Update Days",
    storyStatus: "Story Status",
    completed: "Completed",
    adultStory: "18+ Story",
    adultStoryHelp: "Turn this on when the whole story contains mature or adult content. Readers will see a warning before opening the story.",
    aboutAdultStory: "About 18+ story",
    toggleAdultStory: "Toggle 18+ story",
    episodeSettings: "Episode Settings",
    adultEpisode: "18+ Episode",
    adultEpisodeHelp: "Turn this on when this episode contains mature or adult content. Readers will see a warning before opening the episode.",
    aboutAdultEpisode: "About 18+ episode",
    toggleAdultEpisode: "Toggle 18+ episode",
    freeEpisode: "Free Episode",
    freeEpisodeHelp: "Turn this on to make this episode completely free for readers. Readers will not need to use Coins, Diamonds, Vouchers, or any other unlock method for this episode.",
    aboutFreeEpisode: "About free episode",
    toggleFreeEpisode: "Toggle free episode",
    releaseTime: "Release Time",
    saving: "Saving...",
    processing: "Processing",
    compressing: "Compressing",
    uploading: "Uploading",
    uploadFailed: "Upload failed",
    ready: "Ready",
    dropReplacement: "Drop replacement page here",
    movePageUp: "Move page up",
    movePageDown: "Move page down",
    deletePage: "Delete page",
    retryUpload: "Retry Upload",
    editEpisode: "Edit Episode",
    firstEpisode: "First Episode",
    episode: "Episode",
    pagesStillUploading: "Pages are still being compressed and uploaded.",
    pageUploadsFailed: "{{count}} page upload(s) failed. Retry or remove them.",
    pagesRequired: "{{current}} / {{required}} pages required to continue",
    charactersRequired: "{{current}} / {{required}} characters required to publish",
    charactersTooLong: "{{current}} / {{maximum}} characters. Please shorten this episode.",
    onlyTwoImages: "Only 2 images are allowed in one episode.",
    imageUrlMissing: "Image URL was missing.",
    imageAdded: "Image added.",
    couldNotAddImage: "Could not add image.",
    noBrokenSpacing: "No broken paragraph spacing found.",
    paragraphsCleaned: "Paragraphs cleaned. Please review before saving.",
    adjustCover: "Please adjust the cover first.",
    saveCropFailed: "Could not save crop. Please try another image.",
    chooseReplacementImage: "Choose a replacement image for this page.",
    waitMangaUploads: "Please wait until all manga pages finish uploading.",
    retryFailedPages: "Retry or remove failed manga pages before saving.",
    writeContent: "Please write some episode content.",
    minimumCharacters: "Almost there! Episodes need at least 1,500 characters.",
    maximumCharacters: "This episode is too long. Maximum is 30,000 characters.",
    pleaseLogin: "Please login first.",
    failedUpdateEpisode: "Failed to update episode",
    failedCreateEpisode: "Failed to create episode",
    updatedMissingId: "Episode updated but episode id was missing",
    createdMissingId: "Episode created but episode id was missing",
    cannotConnect: "Cannot connect to backend. Make sure backend is deployed or running.",
    failedSaveDraft: "Failed to save draft",
    storyLoading: "Story information is still loading.",
    failedUpdateStoryInfo: "Failed to update story information.",
    missingEpisodeId: "Missing episode id. Close this popup and click Next again.",
    chooseSchedule: "Please choose schedule date and time.",
    failedSavePublish: "Failed to save publish settings.",
    goBack: "Go back",
    next: "Next",
    loadingEpisodeData: "Loading episode data...",
    mangaPages: "Manga Pages",
    mangaPickHelp: "Choose up to 30 images each time. Maximum 2 MB per image and 100 pages per episode.",
    mangaFileTypes: "JPG, PNG, WebP, HEIC or HEIF · Up to 30 each time",
    mangaDraftHelp: "Drafts may be saved without pages. Add at least {{count}} pages before continuing to Publish.",
    mangaReady: "Manga pages are ready. Use the arrows to confirm their reading order.",
    dropOrAddManga: "Drop or Add Manga Pages",
    uploadingPages: "Uploading pages...",
    insertImage: "Insert image",
    aiSpace: "AI Space",
    youtubeVideo: "YouTube video",
    findReplace: "Find and Replace",
    startWriting: "Start writing your episode...",
    mangaInfo: "Manga Info",
    storyInfo: "Story Info",
    pageCount: "{{count}} pages",
    characterCount: "{{count}} / {{minimum}} characters",
    saved: "Saved",
    saveCountdown: "Save {{seconds}}s",
    failedUploadImage: "Failed to upload image",
    heicEmpty: "HEIC conversion returned an empty image.",
    heicConversionFailed: "This HEIC/HEIF image could not be converted on this device. [convert: HEIC_CONVERSION_FAILED]",
    couldNotReadImage: "Could not read this image.",
    browserCompressFailed: "This browser could not compress the image.",
    chooseImageFirst: "Choose an image first.",
    chooseImageFile: "Please choose an image file.",
    imageTooLarge: "Image must be 5 MB or smaller.",
    imageProcessingUnavailable: "Image processing is unavailable in this browser.",
    compressLimit: "This image could not be compressed below 500 KB.",
    selectedReadFailed: "This device could not read the selected image. [read: IMAGE_FILE_READ_FAILED]",
    selectedEmpty: "The selected image contains 0 bytes. [read: IMAGE_FILE_EMPTY]",
    networkImageFailed: "Network error: the image could not reach the server. Check your connection and try again. [network: IMAGE_REQUEST_FAILED]",
    novelUploadFailed: "Novel image upload failed.",
    imageUrlMissingServer: "The upload finished but the server did not return an image URL. [complete: IMAGE_URL_MISSING]",
    uploadCanceled: "Upload canceled.",
    failedLoadStory: "Failed to load story",
    failedLoadEpisode: "Failed to load episode",
    localDraftRestored: "Local draft restored.",
    processingStatus: "Processing",
    mangaPageAlt: "Manga page {{number}}",
    dropMangaPages: "Drop manga pages here",
    storyTagGroupCharacters: "Characters",
    storyTagGroupRelationship: "Relationship",
    storyTagGroupPlot: "Plot",
    storyTagGroupSetting: "Setting & World",
    storyTagGroupMood: "Mood & Theme",
    storyTagGroupLgbt: "LGBTQ+",
    undo: "Undo",
    redo: "Redo",
    bold: "Bold",
    italic: "Italic",
    alignLeft: "Align left",
    alignCenter: "Align center",
    alignRight: "Align right",
    publishStep: "Publish",
    enterEpisodeTitlePrompt: "Enter episode title",
  },
  km: {
    unsavedChanges: "ការកែប្រែមិនទាន់រក្សាទុក",
    unsavedHelp: "ភាគនេះមានការកែប្រែមិនទាន់រក្សាទុក។ សូមរក្សាទុកព្រាង ឬបោះបង់ការកែប្រែ។",
    keepEditing: "បន្តកែ",
    discard: "បោះបង់",
    saveDraft: "រក្សាទុកព្រាង",
    localDraftFound: "រកឃើញព្រាងក្នុងឧបករណ៍",
    localDraftHelp: "ឧបករណ៍នេះមានការងារថ្មីជាងដែលមិនទាន់រក្សាទុកសម្រាប់ភាគនេះ។ សូមស្ដារវា ឬបោះបង់ច្បាប់ក្នុងឧបករណ៍។",
    discardLocal: "បោះបង់ព្រាងក្នុងឧបករណ៍",
    pleaseWait: "សូមរង់ចាំ...",
    restoreDraft: "ស្ដារព្រាង",
    cleanQuestion: "សម្អាតគម្លាតកថាខណ្ឌ?",
    cleanHelp: "វានឹងជួសជុលបន្ទាត់ដែលបែកពីការបិទភ្ជាប់ ដោយរក្សាសន្ទនា បន្ទាត់ពិសេស និងចន្លោះកថាខណ្ឌ។",
    cancel: "បោះបង់",
    clean: "សម្អាត",
    cropCover: "កាត់រូបគម្របភាគ",
    cropHelp: "អូសរូបនៅក្នុងស៊ុម។ ពង្រីក/បង្រួមដើម្បីកែតម្រូវ។",
    closeCrop: "បិទការកាត់រូប",
    zoom: "ពង្រីក",
    saveCrop: "រក្សាទុកការកាត់",
    closeEpisodeDetails: "បិទព័ត៌មានភាគ",
    episodeDetails: "ព័ត៌មានភាគ",
    save: "រក្សាទុក",
    episodeTitle: "ចំណងជើងភាគ",
    enterEpisodeTitle: "បញ្ចូលចំណងជើងភាគ",
    episodeCover: "គម្របភាគ",
    optional: "មិនចាំបាច់",
    coverHelp: "បើទទេ នឹងប្រើគម្របរឿង។ ណែនាំ 16:9។",
    replace: "ប្ដូរ",
    remove: "ដកចេញ",
    addEpisodeCover: "បន្ថែមគម្របភាគ",
    crop169: "កាត់ 16:9",
    backToPublish: "ត្រឡប់ទៅបោះផ្សាយ",
    addGenre: "បន្ថែមប្រភេទ",
    searchGenre: "ស្វែងរកប្រភេទ",
    genreHelp: "សូមជ្រើសប្រភេទដែលសមនឹងរឿងរបស់អ្នកបំផុត។",
    oneGenre: "អាចជ្រើសបានតែមួយប្រភេទ។",
    loadingGenres: "កំពុងផ្ទុកប្រភេទ...",
    noGenres: "រកមិនឃើញប្រភេទ។",
    addTags: "បន្ថែមស្លាក",
    searchCustomTags: "ស្វែងរក និងបង្កើតស្លាក",
    all: "ទាំងអស់",
    selectedCount: "បានជ្រើស ({{count}}/6)",
    custom: "ផ្ទាល់ខ្លួន",
    writeCustomTag: "សរសេរស្លាកផ្ទាល់ខ្លួន",
    add: "បន្ថែម",
    noTags: "រកមិនឃើញស្លាក។",
    storyLanguage: "ភាសារឿង",
    done: "រួចរាល់",
    closeInformation: "បិទព័ត៌មាន",
    releaseOption: "ជម្រើសបោះផ្សាយ",
    closeReleaseOptions: "បិទជម្រើសបោះផ្សាយ",
    publishNow: "បោះផ្សាយឥឡូវ",
    publishNowHelp: "បោះផ្សាយភាគនេះភ្លាមៗ។",
    schedule: "កំណត់ពេល",
    scheduleHelp: "ជ្រើសកាលបរិច្ឆេទ និងម៉ោងនាពេលអនាគត។",
    saveAsDraft: "រក្សាទុកជាព្រាង",
    saveAsDraftHelp: "រក្សាភាគនេះជាឯកជន ហើយបន្តពេលក្រោយ។",
    chooseDateTime: "ជ្រើសកាលបរិច្ឆេទ និងម៉ោង",
    scheduleRelease: "កំណត់ពេលបោះផ្សាយ",
    ok: "យល់ព្រម",
    year: "ឆ្នាំ",
    month: "ខែ",
    day: "ថ្ងៃ",
    hour: "ម៉ោង",
    minute: "នាទី",
    futureDateTime: "សូមជ្រើសកាលបរិច្ឆេទ និងម៉ោងនាពេលអនាគត។",
    publish: "បោះផ្សាយ",
    untitledEpisode: "ភាគគ្មានចំណងជើង",
    chooseLanguage: "ជ្រើសភាសា",
    mainGenre: "ប្រភេទសំខាន់",
    chooseGenre: "ជ្រើសប្រភេទ",
    tags: "ស្លាក",
    chooseTags: "ជ្រើសស្លាករហូតដល់ 6",
    updateDays: "ថ្ងៃអាប់ដេត",
    storyStatus: "ស្ថានភាពរឿង",
    completed: "បានបញ្ចប់",
    adultStory: "រឿង 18+",
    adultStoryHelp: "បើកវា ពេលរឿងទាំងមូលមានមាតិកាមនុស្សពេញវ័យ។ អ្នកអាននឹងឃើញការព្រមានមុនបើករឿង។",
    aboutAdultStory: "អំពីរឿង 18+",
    toggleAdultStory: "បិទ/បើករឿង 18+",
    episodeSettings: "ការកំណត់ភាគ",
    adultEpisode: "ភាគ 18+",
    adultEpisodeHelp: "បើកវា ពេលភាគនេះមានមាតិកាមនុស្សពេញវ័យ។ អ្នកអាននឹងឃើញការព្រមានមុនបើកភាគ។",
    aboutAdultEpisode: "អំពីភាគ 18+",
    toggleAdultEpisode: "បិទ/បើកភាគ 18+",
    freeEpisode: "ភាគឥតគិតថ្លៃ",
    freeEpisodeHelp: "បើកវាដើម្បីឱ្យភាគនេះឥតគិតថ្លៃទាំងស្រុង។ អ្នកអានមិនត្រូវប្រើ Coins, Diamonds, Vouchers ឬវិធីដោះសោផ្សេងទៀតទេ។",
    aboutFreeEpisode: "អំពីភាគឥតគិតថ្លៃ",
    toggleFreeEpisode: "បិទ/បើកភាគឥតគិតថ្លៃ",
    releaseTime: "ម៉ោងបោះផ្សាយ",
    saving: "កំពុងរក្សាទុក...",
    processing: "កំពុងដំណើរការ",
    compressing: "កំពុងបង្ហាប់",
    uploading: "កំពុងអាប់ឡូដ",
    uploadFailed: "អាប់ឡូដបរាជ័យ",
    ready: "រួចរាល់",
    dropReplacement: "ទម្លាក់រូបជំនួសនៅទីនេះ",
    movePageUp: "ផ្លាស់ទំព័រឡើង",
    movePageDown: "ផ្លាស់ទំព័រចុះ",
    deletePage: "លុបទំព័រ",
    retryUpload: "អាប់ឡូដម្ដងទៀត",
    editEpisode: "កែភាគ",
    firstEpisode: "ភាគដំបូង",
    episode: "ភាគ",
    pagesStillUploading: "ទំព័រកំពុងត្រូវបានបង្ហាប់ និងអាប់ឡូដ។",
    pageUploadsFailed: "ការអាប់ឡូដ {{count}} ទំព័របរាជ័យ។ សូមព្យាយាមម្ដងទៀត ឬដកចេញ។",
    pagesRequired: "{{current}} / {{required}} ទំព័រត្រូវការដើម្បីបន្ត",
    charactersRequired: "{{current}} / {{required}} តួអក្សរត្រូវការដើម្បីបោះផ្សាយ",
    charactersTooLong: "{{current}} / {{maximum}} តួអក្សរ។ សូមកាត់បន្ថយភាគនេះ។",
    onlyTwoImages: "អនុញ្ញាតរូបតែ 2 ក្នុងមួយភាគ។",
    imageUrlMissing: "បាត់ URL រូបភាព។",
    imageAdded: "បានបន្ថែមរូបភាព។",
    couldNotAddImage: "មិនអាចបន្ថែមរូបភាពបានទេ។",
    noBrokenSpacing: "មិនមានគម្លាតកថាខណ្ឌដែលខូចទេ។",
    paragraphsCleaned: "បានសម្អាតកថាខណ្ឌ។ សូមពិនិត្យមុនរក្សាទុក។",
    adjustCover: "សូមកែគម្របជាមុន។",
    saveCropFailed: "មិនអាចរក្សាទុកការកាត់រូបបានទេ។ សូមសាករូបផ្សេង។",
    chooseReplacementImage: "ជ្រើសរូបជំនួសសម្រាប់ទំព័រនេះ។",
    waitMangaUploads: "សូមរង់ចាំរហូតដល់ទំព័រ Manga ទាំងអស់អាប់ឡូដចប់។",
    retryFailedPages: "សូមអាប់ឡូដទំព័រដែលបរាជ័យម្ដងទៀត ឬដកចេញមុនរក្សាទុក។",
    writeContent: "សូមសរសេរមាតិកាភាគ។",
    minimumCharacters: "ជិតរួចហើយ! ភាគត្រូវការយ៉ាងតិច 1,500 តួអក្សរ។",
    maximumCharacters: "ភាគនេះវែងពេក។ អតិបរមា 30,000 តួអក្សរ។",
    pleaseLogin: "សូមចូលគណនីជាមុន។",
    failedUpdateEpisode: "មិនអាចអាប់ដេតភាគបានទេ",
    failedCreateEpisode: "មិនអាចបង្កើតភាគបានទេ",
    updatedMissingId: "បានអាប់ដេតភាគ ប៉ុន្តែបាត់លេខសម្គាល់ភាគ",
    createdMissingId: "បានបង្កើតភាគ ប៉ុន្តែបាត់លេខសម្គាល់ភាគ",
    cannotConnect: "មិនអាចភ្ជាប់ទៅ Backend បានទេ។ សូមពិនិត្យការដាក់ឱ្យដំណើរការ។",
    failedSaveDraft: "មិនអាចរក្សាទុកព្រាងបានទេ",
    storyLoading: "ព័ត៌មានរឿងកំពុងផ្ទុក។",
    failedUpdateStoryInfo: "មិនអាចអាប់ដេតព័ត៌មានរឿងបានទេ។",
    missingEpisodeId: "បាត់លេខសម្គាល់ភាគ។ បិទផ្ទាំងនេះ ហើយចុច បន្ទាប់ ម្ដងទៀត។",
    chooseSchedule: "សូមជ្រើសកាលបរិច្ឆេទ និងម៉ោងកំណត់ពេល។",
    failedSavePublish: "មិនអាចរក្សាទុកការកំណត់បោះផ្សាយបានទេ។",
    goBack: "ត្រឡប់ក្រោយ",
    next: "បន្ទាប់",
    loadingEpisodeData: "កំពុងផ្ទុកទិន្នន័យភាគ...",
    mangaPages: "ទំព័រ Manga",
    mangaPickHelp: "ជ្រើសរូបបានរហូតដល់ 30 ក្នុងមួយដង។ អតិបរមា 2 MB ក្នុងមួយរូប និង 100 ទំព័រក្នុងមួយភាគ។",
    mangaFileTypes: "JPG, PNG, WebP, HEIC ឬ HEIF · រហូតដល់ 30 ក្នុងមួយដង",
    mangaDraftHelp: "អាចរក្សាទុកព្រាងដោយគ្មានទំព័រ។ បន្ថែមយ៉ាងតិច {{count}} ទំព័រមុនបោះផ្សាយ។",
    mangaReady: "ទំព័រ Manga រួចរាល់។ ប្រើព្រួញដើម្បីផ្ទៀងលំដាប់អាន។",
    dropOrAddManga: "ទម្លាក់ ឬបន្ថែមទំព័រ Manga",
    uploadingPages: "កំពុងអាប់ឡូដទំព័រ...",
    insertImage: "បញ្ចូលរូបភាព",
    aiSpace: "AI Space",
    youtubeVideo: "វីដេអូ YouTube",
    findReplace: "ស្វែងរក និងជំនួស",
    startWriting: "ចាប់ផ្តើមសរសេរភាគរបស់អ្នក...",
    mangaInfo: "ព័ត៌មាន Manga",
    storyInfo: "ព័ត៌មានរឿង",
    pageCount: "{{count}} ទំព័រ",
    characterCount: "{{count}} / {{minimum}} តួអក្សរ",
    saved: "បានរក្សាទុក",
    saveCountdown: "រក្សាទុក {{seconds}} វិ.",
    failedUploadImage: "អាប់ឡូដរូបភាពបរាជ័យ",
    heicEmpty: "ការបម្លែង HEIC បានរូបទទេ។",
    heicConversionFailed: "មិនអាចបម្លែងរូប HEIC/HEIF នៅលើឧបករណ៍នេះបានទេ។ [convert: HEIC_CONVERSION_FAILED]",
    couldNotReadImage: "មិនអាចអានរូបនេះបានទេ។",
    browserCompressFailed: "Browser នេះមិនអាចបង្ហាប់រូបបានទេ។",
    chooseImageFirst: "សូមជ្រើសរូបភាពជាមុន។",
    chooseImageFile: "សូមជ្រើសឯកសាររូបភាព។",
    imageTooLarge: "រូបភាពត្រូវមានទំហំ 5 MB ឬតិចជាងនេះ។",
    imageProcessingUnavailable: "មិនអាចដំណើរការរូបភាពនៅក្នុង Browser នេះបានទេ។",
    compressLimit: "មិនអាចបង្ហាប់រូបនេះឱ្យក្រោម 500 KB បានទេ។",
    selectedReadFailed: "ឧបករណ៍នេះមិនអាចអានរូបដែលបានជ្រើសបានទេ។ [read: IMAGE_FILE_READ_FAILED]",
    selectedEmpty: "រូបដែលបានជ្រើសមានទំហំ 0 bytes។ [read: IMAGE_FILE_EMPTY]",
    networkImageFailed: "បញ្ហាបណ្តាញ៖ រូបភាពមិនអាចទៅដល់ server បានទេ។ សូមពិនិត្យអ៊ីនធឺណិត ហើយសាកម្ដងទៀត។ [network: IMAGE_REQUEST_FAILED]",
    novelUploadFailed: "អាប់ឡូដរូប Novel បរាជ័យ។",
    imageUrlMissingServer: "អាប់ឡូដចប់ ប៉ុន្តែ server មិនបានផ្ដល់ URL រូបភាព។ [complete: IMAGE_URL_MISSING]",
    uploadCanceled: "បានបោះបង់ការអាប់ឡូដ។",
    failedLoadStory: "មិនអាចផ្ទុករឿងបានទេ",
    failedLoadEpisode: "មិនអាចផ្ទុកភាគបានទេ",
    localDraftRestored: "បានស្ដារព្រាងក្នុងឧបករណ៍។",
    processingStatus: "កំពុងដំណើរការ",
    mangaPageAlt: "ទំព័រ Manga {{number}}",
    dropMangaPages: "ទម្លាក់ទំព័រ Manga នៅទីនេះ",
    storyTagGroupCharacters: "តួអង្គ",
    storyTagGroupRelationship: "ទំនាក់ទំនង",
    storyTagGroupPlot: "គ្រោងរឿង",
    storyTagGroupSetting: "ទីកន្លែង និងពិភព",
    storyTagGroupMood: "អារម្មណ៍ និងប្រធានបទ",
    storyTagGroupLgbt: "LGBTQ+",
    undo: "ត្រឡប់ការកែ",
    redo: "ធ្វើឡើងវិញ",
    bold: "អក្សរដិត",
    italic: "អក្សរទ្រេត",
    alignLeft: "តម្រឹមឆ្វេង",
    alignCenter: "តម្រឹមកណ្ដាល",
    alignRight: "តម្រឹមស្ដាំ",
    publishStep: "បោះផ្សាយ",
    enterEpisodeTitlePrompt: "បញ្ចូលចំណងជើងភាគ",
  },
  zh: {
    unsavedChanges: "未保存的更改",
    unsavedHelp: "此章节有未保存的编辑。请保存草稿或放弃更改。",
    keepEditing: "继续编辑",
    discard: "放弃",
    saveDraft: "保存草稿",
    localDraftFound: "发现本地草稿",
    localDraftHelp: "此设备上有更新的未保存内容。请先恢复或放弃本地副本。",
    discardLocal: "放弃本地草稿",
    pleaseWait: "请稍候...",
    restoreDraft: "恢复草稿",
    cleanQuestion: "清理段落间距？",
    cleanHelp: "将修复粘贴造成的断行，同时保留对话、特殊行和段落。",
    cancel: "取消",
    clean: "清理",
    cropCover: "裁剪章节封面",
    cropHelp: "在框内拖动图片，可缩放进行调整。",
    closeCrop: "关闭裁剪",
    zoom: "缩放",
    saveCrop: "保存裁剪",
    closeEpisodeDetails: "关闭章节详情",
    episodeDetails: "章节详情",
    save: "保存",
    episodeTitle: "章节标题",
    enterEpisodeTitle: "输入章节标题",
    episodeCover: "章节封面",
    optional: "可选",
    coverHelp: "留空时使用故事封面。建议 16:9。",
    replace: "替换",
    remove: "移除",
    addEpisodeCover: "添加章节封面",
    crop169: "16:9 裁剪",
    backToPublish: "返回发布",
    addGenre: "添加类型",
    searchGenre: "搜索类型",
    genreHelp: "请选择最能代表故事的类型。",
    oneGenre: "只能选择一个类型。",
    loadingGenres: "正在加载类型...",
    noGenres: "未找到类型。",
    addTags: "添加标签",
    searchCustomTags: "搜索和自定义标签",
    all: "全部",
    selectedCount: "已选择 ({{count}}/6)",
    custom: "自定义",
    writeCustomTag: "输入自定义标签",
    add: "添加",
    noTags: "未找到标签。",
    storyLanguage: "故事语言",
    done: "完成",
    closeInformation: "关闭信息",
    releaseOption: "发布方式",
    closeReleaseOptions: "关闭发布方式",
    publishNow: "立即发布",
    publishNowHelp: "立即公开此章节。",
    schedule: "定时",
    scheduleHelp: "选择未来的日期和时间。",
    saveAsDraft: "保存为草稿",
    saveAsDraftHelp: "保持私密并稍后完成。",
    chooseDateTime: "选择日期和时间",
    scheduleRelease: "定时发布",
    ok: "确定",
    year: "年",
    month: "月",
    day: "日",
    hour: "时",
    minute: "分",
    futureDateTime: "请选择未来的日期和时间。",
    publish: "发布",
    untitledEpisode: "未命名章节",
    chooseLanguage: "选择语言",
    mainGenre: "主要类型",
    chooseGenre: "选择类型",
    tags: "标签",
    chooseTags: "最多选择 6 个标签",
    updateDays: "更新日",
    storyStatus: "故事状态",
    completed: "已完结",
    adultStory: "18+ 故事",
    adultStoryHelp: "当整个故事含成人内容时开启。读者打开故事前会看到警告。",
    aboutAdultStory: "关于 18+ 故事",
    toggleAdultStory: "切换 18+ 故事",
    episodeSettings: "章节设置",
    adultEpisode: "18+ 章节",
    adultEpisodeHelp: "当本章节含成人内容时开启。读者打开章节前会看到警告。",
    aboutAdultEpisode: "关于 18+ 章节",
    toggleAdultEpisode: "切换 18+ 章节",
    freeEpisode: "免费章节",
    freeEpisodeHelp: "开启后本章节完全免费，不需要 Coins、Diamonds、Vouchers 或其他解锁方式。",
    aboutFreeEpisode: "关于免费章节",
    toggleFreeEpisode: "切换免费章节",
    releaseTime: "发布时间",
    saving: "保存中...",
    processing: "处理中",
    compressing: "压缩中",
    uploading: "上传中",
    uploadFailed: "上传失败",
    ready: "就绪",
    dropReplacement: "将替换页面拖到这里",
    movePageUp: "页面上移",
    movePageDown: "页面下移",
    deletePage: "删除页面",
    retryUpload: "重新上传",
    editEpisode: "编辑章节",
    firstEpisode: "第一章",
    episode: "章节",
    pagesStillUploading: "页面仍在压缩和上传。",
    pageUploadsFailed: "{{count}} 个页面上传失败，请重试或移除。",
    pagesRequired: "{{current}} / {{required}} 页，需要达到要求才能继续",
    charactersRequired: "{{current}} / {{required}} 字符，需要达到要求才能发布",
    charactersTooLong: "{{current}} / {{maximum}} 字符。请缩短本章节。",
    onlyTwoImages: "每个章节最多允许 2 张图片。",
    imageUrlMissing: "缺少图片 URL。",
    imageAdded: "图片已添加。",
    couldNotAddImage: "无法添加图片。",
    noBrokenSpacing: "未发现异常段落间距。",
    paragraphsCleaned: "段落已清理，请在保存前检查。",
    adjustCover: "请先调整封面。",
    saveCropFailed: "无法保存裁剪，请尝试其他图片。",
    chooseReplacementImage: "请选择此页面的替换图片。",
    waitMangaUploads: "请等待所有 Manga 页面上传完成。",
    retryFailedPages: "保存前请重试或移除失败页面。",
    writeContent: "请填写章节内容。",
    minimumCharacters: "快完成了！章节至少需要 1,500 个字符。",
    maximumCharacters: "章节过长，最多 30,000 个字符。",
    pleaseLogin: "请先登录。",
    failedUpdateEpisode: "无法更新章节",
    failedCreateEpisode: "无法创建章节",
    updatedMissingId: "章节已更新，但缺少章节 ID",
    createdMissingId: "章节已创建，但缺少章节 ID",
    cannotConnect: "无法连接后端，请确认后端已部署或正在运行。",
    failedSaveDraft: "无法保存草稿",
    storyLoading: "故事信息仍在加载。",
    failedUpdateStoryInfo: "无法更新故事信息。",
    missingEpisodeId: "缺少章节 ID。关闭此窗口后再次点击“下一步”。",
    chooseSchedule: "请选择定时日期和时间。",
    failedSavePublish: "无法保存发布设置。",
    goBack: "返回",
    next: "下一步",
    loadingEpisodeData: "正在加载章节数据...",
    mangaPages: "Manga 页面",
    mangaPickHelp: "每次最多选择 30 张图片。每张最多 2 MB，每章最多 100 页。",
    mangaFileTypes: "JPG、PNG、WebP、HEIC 或 HEIF · 每次最多 30 张",
    mangaDraftHelp: "草稿可以不含页面。发布前至少添加 {{count}} 页。",
    mangaReady: "Manga 页面已准备好，请使用箭头确认阅读顺序。",
    dropOrAddManga: "拖入或添加 Manga 页面",
    uploadingPages: "正在上传页面...",
    insertImage: "插入图片",
    aiSpace: "AI 空间",
    youtubeVideo: "YouTube 视频",
    findReplace: "查找和替换",
    startWriting: "开始编写章节...",
    mangaInfo: "Manga 信息",
    storyInfo: "故事信息",
    pageCount: "{{count}} 页",
    characterCount: "{{count}} / {{minimum}} 字符",
    saved: "已保存",
    saveCountdown: "{{seconds}} 秒后保存",
    failedUploadImage: "图片上传失败",
    heicEmpty: "HEIC 转换得到空图片。",
    heicConversionFailed: "此设备无法转换 HEIC/HEIF 图片。[convert: HEIC_CONVERSION_FAILED]",
    couldNotReadImage: "无法读取此图片。",
    browserCompressFailed: "浏览器无法压缩此图片。",
    chooseImageFirst: "请先选择图片。",
    chooseImageFile: "请选择图片文件。",
    imageTooLarge: "图片必须小于或等于 5 MB。",
    imageProcessingUnavailable: "此浏览器无法处理图片。",
    compressLimit: "无法将图片压缩到 500 KB 以下。",
    selectedReadFailed: "此设备无法读取所选图片。[read: IMAGE_FILE_READ_FAILED]",
    selectedEmpty: "所选图片大小为 0 bytes。[read: IMAGE_FILE_EMPTY]",
    networkImageFailed: "网络错误：图片无法到达服务器。请检查网络后重试。[network: IMAGE_REQUEST_FAILED]",
    novelUploadFailed: "Novel 图片上传失败。",
    imageUrlMissingServer: "上传完成，但服务器没有返回图片 URL。[complete: IMAGE_URL_MISSING]",
    uploadCanceled: "上传已取消。",
    failedLoadStory: "无法加载故事",
    failedLoadEpisode: "无法加载章节",
    localDraftRestored: "本地草稿已恢复。",
    processingStatus: "处理中",
    mangaPageAlt: "Manga 第 {{number}} 页",
    dropMangaPages: "将 Manga 页面拖到这里",
    storyTagGroupCharacters: "角色",
    storyTagGroupRelationship: "关系",
    storyTagGroupPlot: "情节",
    storyTagGroupSetting: "背景与世界",
    storyTagGroupMood: "氛围与主题",
    storyTagGroupLgbt: "LGBTQ+",
    undo: "撤销",
    redo: "重做",
    bold: "粗体",
    italic: "斜体",
    alignLeft: "左对齐",
    alignCenter: "居中",
    alignRight: "右对齐",
    publishStep: "发布",
    enterEpisodeTitlePrompt: "输入章节标题",
  },
  ja: {
    unsavedChanges: "未保存の変更",
    unsavedHelp: "このエピソードには未保存の編集があります。下書きを保存するか変更を破棄してください。",
    keepEditing: "編集を続ける",
    discard: "破棄",
    saveDraft: "下書きを保存",
    localDraftFound: "ローカル下書きが見つかりました",
    localDraftHelp: "この端末に新しい未保存内容があります。復元するかローカルコピーを破棄してください。",
    discardLocal: "ローカル下書きを破棄",
    pleaseWait: "お待ちください...",
    restoreDraft: "下書きを復元",
    cleanQuestion: "段落間隔を整えますか？",
    cleanHelp: "貼り付け時の不自然な改行を修正し、会話や特殊行、段落は保持します。",
    cancel: "キャンセル",
    clean: "整理",
    cropCover: "エピソード表紙を切り抜く",
    cropHelp: "枠内で画像をドラッグし、ズームして調整できます。",
    closeCrop: "切り抜きを閉じる",
    zoom: "ズーム",
    saveCrop: "切り抜きを保存",
    closeEpisodeDetails: "エピソード詳細を閉じる",
    episodeDetails: "エピソード詳細",
    save: "保存",
    episodeTitle: "エピソードタイトル",
    enterEpisodeTitle: "エピソードタイトルを入力",
    episodeCover: "エピソード表紙",
    optional: "任意",
    coverHelp: "空欄の場合はストーリー表紙を使用します。推奨 16:9。",
    replace: "変更",
    remove: "削除",
    addEpisodeCover: "表紙を追加",
    crop169: "16:9 切り抜き",
    backToPublish: "公開画面に戻る",
    addGenre: "ジャンルを追加",
    searchGenre: "ジャンルを検索",
    genreHelp: "ストーリーに最も合うジャンルを選択してください。",
    oneGenre: "ジャンルは1つだけ選択できます。",
    loadingGenres: "ジャンルを読み込み中...",
    noGenres: "ジャンルが見つかりません。",
    addTags: "タグを追加",
    searchCustomTags: "タグを検索・作成",
    all: "すべて",
    selectedCount: "選択済み ({{count}}/6)",
    custom: "カスタム",
    writeCustomTag: "カスタムタグを入力",
    add: "追加",
    noTags: "タグが見つかりません。",
    storyLanguage: "ストーリー言語",
    done: "完了",
    closeInformation: "情報を閉じる",
    releaseOption: "公開方法",
    closeReleaseOptions: "公開方法を閉じる",
    publishNow: "今すぐ公開",
    publishNowHelp: "このエピソードをすぐ公開します。",
    schedule: "予約",
    scheduleHelp: "未来の日付と時刻を選択します。",
    saveAsDraft: "下書き保存",
    saveAsDraftHelp: "非公開のまま保存し、後で仕上げます。",
    chooseDateTime: "日付と時刻を選択",
    scheduleRelease: "公開予約",
    ok: "OK",
    year: "年",
    month: "月",
    day: "日",
    hour: "時",
    minute: "分",
    futureDateTime: "未来の日付と時刻を選択してください。",
    publish: "公開",
    untitledEpisode: "無題のエピソード",
    chooseLanguage: "言語を選択",
    mainGenre: "メインジャンル",
    chooseGenre: "ジャンルを選択",
    tags: "タグ",
    chooseTags: "最大6個のタグを選択",
    updateDays: "更新曜日",
    storyStatus: "ストーリー状態",
    completed: "完結",
    adultStory: "18+ ストーリー",
    adultStoryHelp: "ストーリー全体に成人向け内容がある場合に有効にします。読者には事前警告が表示されます。",
    aboutAdultStory: "18+ ストーリーについて",
    toggleAdultStory: "18+ ストーリー切替",
    episodeSettings: "エピソード設定",
    adultEpisode: "18+ エピソード",
    adultEpisodeHelp: "このエピソードに成人向け内容がある場合に有効にします。読者には事前警告が表示されます。",
    aboutAdultEpisode: "18+ エピソードについて",
    toggleAdultEpisode: "18+ エピソード切替",
    freeEpisode: "無料エピソード",
    freeEpisodeHelp: "このエピソードを完全無料にします。Coins、Diamonds、Vouchers などの解除手段は不要です。",
    aboutFreeEpisode: "無料エピソードについて",
    toggleFreeEpisode: "無料エピソード切替",
    releaseTime: "公開時刻",
    saving: "保存中...",
    processing: "処理中",
    compressing: "圧縮中",
    uploading: "アップロード中",
    uploadFailed: "アップロード失敗",
    ready: "準備完了",
    dropReplacement: "置き換えページをここにドロップ",
    movePageUp: "ページを上へ",
    movePageDown: "ページを下へ",
    deletePage: "ページを削除",
    retryUpload: "再アップロード",
    editEpisode: "エピソードを編集",
    firstEpisode: "最初のエピソード",
    episode: "エピソード",
    pagesStillUploading: "ページを圧縮・アップロードしています。",
    pageUploadsFailed: "{{count}} ページのアップロードに失敗しました。再試行または削除してください。",
    pagesRequired: "{{current}} / {{required}} ページ必要です",
    charactersRequired: "{{current}} / {{required}} 文字必要です",
    charactersTooLong: "{{current}} / {{maximum}} 文字。エピソードを短くしてください。",
    onlyTwoImages: "1エピソードにつき画像は2枚までです。",
    imageUrlMissing: "画像 URL がありません。",
    imageAdded: "画像を追加しました。",
    couldNotAddImage: "画像を追加できませんでした。",
    noBrokenSpacing: "崩れた段落間隔は見つかりませんでした。",
    paragraphsCleaned: "段落を整理しました。保存前に確認してください。",
    adjustCover: "先に表紙を調整してください。",
    saveCropFailed: "切り抜きを保存できませんでした。別の画像をお試しください。",
    chooseReplacementImage: "このページの置き換え画像を選択してください。",
    waitMangaUploads: "すべての Manga ページのアップロード完了を待ってください。",
    retryFailedPages: "失敗したページを再試行または削除してから保存してください。",
    writeContent: "エピソード内容を入力してください。",
    minimumCharacters: "もう少しです！エピソードは最低 1,500 文字必要です。",
    maximumCharacters: "エピソードが長すぎます。最大 30,000 文字です。",
    pleaseLogin: "先にログインしてください。",
    failedUpdateEpisode: "エピソードを更新できませんでした",
    failedCreateEpisode: "エピソードを作成できませんでした",
    updatedMissingId: "更新しましたがエピソード ID がありません",
    createdMissingId: "作成しましたがエピソード ID がありません",
    cannotConnect: "バックエンドに接続できません。デプロイまたは稼働状態を確認してください。",
    failedSaveDraft: "下書きを保存できませんでした",
    storyLoading: "ストーリー情報を読み込み中です。",
    failedUpdateStoryInfo: "ストーリー情報を更新できませんでした。",
    missingEpisodeId: "エピソード ID がありません。この画面を閉じてもう一度「次へ」を押してください。",
    chooseSchedule: "予約日時を選択してください。",
    failedSavePublish: "公開設定を保存できませんでした。",
    goBack: "戻る",
    next: "次へ",
    loadingEpisodeData: "エピソードデータを読み込み中...",
    mangaPages: "Manga ページ",
    mangaPickHelp: "一度に最大30枚選択できます。1枚2MBまで、1エピソード100ページまでです。",
    mangaFileTypes: "JPG、PNG、WebP、HEIC、HEIF · 一度に最大30枚",
    mangaDraftHelp: "下書きはページなしでも保存できます。公開前に最低 {{count}} ページ追加してください。",
    mangaReady: "Manga ページの準備ができました。矢印で読む順番を確認してください。",
    dropOrAddManga: "Manga ページをドロップまたは追加",
    uploadingPages: "ページをアップロード中...",
    insertImage: "画像を挿入",
    aiSpace: "AI スペース",
    youtubeVideo: "YouTube 動画",
    findReplace: "検索と置換",
    startWriting: "エピソードを書き始める...",
    mangaInfo: "Manga 情報",
    storyInfo: "ストーリー情報",
    pageCount: "{{count}} ページ",
    characterCount: "{{count}} / {{minimum}} 文字",
    saved: "保存済み",
    saveCountdown: "{{seconds}}秒後に保存",
    failedUploadImage: "画像のアップロードに失敗しました",
    heicEmpty: "HEIC 変換で空の画像が返されました。",
    heicConversionFailed: "この端末では HEIC/HEIF 画像を変換できませんでした。[convert: HEIC_CONVERSION_FAILED]",
    couldNotReadImage: "画像を読み込めませんでした。",
    browserCompressFailed: "このブラウザでは画像を圧縮できません。",
    chooseImageFirst: "先に画像を選択してください。",
    chooseImageFile: "画像ファイルを選択してください。",
    imageTooLarge: "画像は 5 MB 以下にしてください。",
    imageProcessingUnavailable: "このブラウザでは画像処理を利用できません。",
    compressLimit: "画像を 500 KB 未満に圧縮できませんでした。",
    selectedReadFailed: "この端末で選択した画像を読み込めませんでした。[read: IMAGE_FILE_READ_FAILED]",
    selectedEmpty: "選択した画像は 0 bytes です。[read: IMAGE_FILE_EMPTY]",
    networkImageFailed: "ネットワークエラー：画像をサーバーへ送れませんでした。接続を確認して再試行してください。[network: IMAGE_REQUEST_FAILED]",
    novelUploadFailed: "Novel 画像のアップロードに失敗しました。",
    imageUrlMissingServer: "アップロード完了後にサーバーから画像 URL が返されませんでした。[complete: IMAGE_URL_MISSING]",
    uploadCanceled: "アップロードをキャンセルしました。",
    failedLoadStory: "ストーリーを読み込めませんでした",
    failedLoadEpisode: "エピソードを読み込めませんでした",
    localDraftRestored: "ローカル下書きを復元しました。",
    processingStatus: "処理中",
    mangaPageAlt: "Manga ページ {{number}}",
    dropMangaPages: "Manga ページをここにドロップ",
    storyTagGroupCharacters: "キャラクター",
    storyTagGroupRelationship: "関係",
    storyTagGroupPlot: "プロット",
    storyTagGroupSetting: "舞台・世界",
    storyTagGroupMood: "雰囲気・テーマ",
    storyTagGroupLgbt: "LGBTQ+",
    undo: "元に戻す",
    redo: "やり直す",
    bold: "太字",
    italic: "斜体",
    alignLeft: "左揃え",
    alignCenter: "中央揃え",
    alignRight: "右揃え",
    publishStep: "公開",
    enterEpisodeTitlePrompt: "エピソードタイトルを入力",
  },
  ko: {
    unsavedChanges: "저장되지 않은 변경사항",
    unsavedHelp: "이 에피소드에 저장되지 않은 편집 내용이 있습니다. 초안을 저장하거나 변경사항을 버리세요.",
    keepEditing: "계속 편집",
    discard: "버리기",
    saveDraft: "초안 저장",
    localDraftFound: "로컬 초안 발견",
    localDraftHelp: "이 기기에 더 최신의 저장되지 않은 작업이 있습니다. 복원하거나 로컬 사본을 버리세요.",
    discardLocal: "로컬 초안 버리기",
    pleaseWait: "잠시 기다려 주세요...",
    restoreDraft: "초안 복원",
    cleanQuestion: "문단 간격을 정리할까요?",
    cleanHelp: "붙여넣기로 깨진 줄바꿈을 수정하면서 대화, 특수 줄, 문단 구분은 유지합니다.",
    cancel: "취소",
    clean: "정리",
    cropCover: "에피소드 표지 자르기",
    cropHelp: "프레임 안에서 이미지를 드래그하고 확대/축소하여 조정하세요.",
    closeCrop: "자르기 닫기",
    zoom: "확대/축소",
    saveCrop: "자르기 저장",
    closeEpisodeDetails: "에피소드 세부정보 닫기",
    episodeDetails: "에피소드 세부정보",
    save: "저장",
    episodeTitle: "에피소드 제목",
    enterEpisodeTitle: "에피소드 제목 입력",
    episodeCover: "에피소드 표지",
    optional: "선택",
    coverHelp: "비워두면 스토리 표지를 사용합니다. 권장 16:9.",
    replace: "교체",
    remove: "삭제",
    addEpisodeCover: "에피소드 표지 추가",
    crop169: "16:9 자르기",
    backToPublish: "게시 화면으로 돌아가기",
    addGenre: "장르 추가",
    searchGenre: "장르 검색",
    genreHelp: "스토리를 가장 잘 나타내는 장르를 선택하세요.",
    oneGenre: "장르는 하나만 선택할 수 있습니다.",
    loadingGenres: "장르 불러오는 중...",
    noGenres: "장르를 찾을 수 없습니다.",
    addTags: "태그 추가",
    searchCustomTags: "태그 검색 및 직접 추가",
    all: "전체",
    selectedCount: "선택됨 ({{count}}/6)",
    custom: "직접 추가",
    writeCustomTag: "사용자 태그 입력",
    add: "추가",
    noTags: "태그를 찾을 수 없습니다.",
    storyLanguage: "스토리 언어",
    done: "완료",
    closeInformation: "정보 닫기",
    releaseOption: "게시 옵션",
    closeReleaseOptions: "게시 옵션 닫기",
    publishNow: "지금 게시",
    publishNowHelp: "이 에피소드를 즉시 공개합니다.",
    schedule: "예약",
    scheduleHelp: "미래 날짜와 시간을 선택합니다.",
    saveAsDraft: "초안으로 저장",
    saveAsDraftHelp: "비공개로 저장하고 나중에 마무리합니다.",
    chooseDateTime: "날짜 및 시간 선택",
    scheduleRelease: "게시 예약",
    ok: "확인",
    year: "년",
    month: "월",
    day: "일",
    hour: "시",
    minute: "분",
    futureDateTime: "미래 날짜와 시간을 선택해 주세요.",
    publish: "게시",
    untitledEpisode: "제목 없는 에피소드",
    chooseLanguage: "언어 선택",
    mainGenre: "주요 장르",
    chooseGenre: "장르 선택",
    tags: "태그",
    chooseTags: "태그 최대 6개 선택",
    updateDays: "업데이트 요일",
    storyStatus: "스토리 상태",
    completed: "완결",
    adultStory: "18+ 스토리",
    adultStoryHelp: "스토리 전체에 성인 콘텐츠가 있을 때 켜세요. 독자에게 열기 전 경고가 표시됩니다.",
    aboutAdultStory: "18+ 스토리 안내",
    toggleAdultStory: "18+ 스토리 전환",
    episodeSettings: "에피소드 설정",
    adultEpisode: "18+ 에피소드",
    adultEpisodeHelp: "이 에피소드에 성인 콘텐츠가 있을 때 켜세요. 독자에게 열기 전 경고가 표시됩니다.",
    aboutAdultEpisode: "18+ 에피소드 안내",
    toggleAdultEpisode: "18+ 에피소드 전환",
    freeEpisode: "무료 에피소드",
    freeEpisodeHelp: "이 에피소드를 완전히 무료로 설정합니다. Coins, Diamonds, Vouchers 등 잠금 해제 수단이 필요하지 않습니다.",
    aboutFreeEpisode: "무료 에피소드 안내",
    toggleFreeEpisode: "무료 에피소드 전환",
    releaseTime: "게시 시간",
    saving: "저장 중...",
    processing: "처리 중",
    compressing: "압축 중",
    uploading: "업로드 중",
    uploadFailed: "업로드 실패",
    ready: "준비됨",
    dropReplacement: "교체할 페이지를 여기에 놓으세요",
    movePageUp: "페이지 위로 이동",
    movePageDown: "페이지 아래로 이동",
    deletePage: "페이지 삭제",
    retryUpload: "업로드 다시 시도",
    editEpisode: "에피소드 편집",
    firstEpisode: "첫 에피소드",
    episode: "에피소드",
    pagesStillUploading: "페이지를 압축하고 업로드하는 중입니다.",
    pageUploadsFailed: "{{count}}개 페이지 업로드에 실패했습니다. 다시 시도하거나 삭제하세요.",
    pagesRequired: "{{current}} / {{required}} 페이지가 필요합니다",
    charactersRequired: "{{current}} / {{required}} 문자가 필요합니다",
    charactersTooLong: "{{current}} / {{maximum}} 문자입니다. 에피소드를 줄여 주세요.",
    onlyTwoImages: "에피소드당 이미지는 최대 2개입니다.",
    imageUrlMissing: "이미지 URL이 없습니다.",
    imageAdded: "이미지가 추가되었습니다.",
    couldNotAddImage: "이미지를 추가하지 못했습니다.",
    noBrokenSpacing: "깨진 문단 간격이 없습니다.",
    paragraphsCleaned: "문단을 정리했습니다. 저장 전 확인해 주세요.",
    adjustCover: "먼저 표지를 조정해 주세요.",
    saveCropFailed: "자르기를 저장하지 못했습니다. 다른 이미지를 시도해 주세요.",
    chooseReplacementImage: "이 페이지의 교체 이미지를 선택하세요.",
    waitMangaUploads: "모든 Manga 페이지 업로드가 끝날 때까지 기다려 주세요.",
    retryFailedPages: "저장하기 전에 실패한 페이지를 다시 시도하거나 삭제하세요.",
    writeContent: "에피소드 내용을 작성해 주세요.",
    minimumCharacters: "거의 완료되었습니다! 에피소드는 최소 1,500자가 필요합니다.",
    maximumCharacters: "에피소드가 너무 깁니다. 최대 30,000자입니다.",
    pleaseLogin: "먼저 로그인해 주세요.",
    failedUpdateEpisode: "에피소드를 업데이트하지 못했습니다",
    failedCreateEpisode: "에피소드를 생성하지 못했습니다",
    updatedMissingId: "에피소드가 업데이트되었지만 ID가 없습니다",
    createdMissingId: "에피소드가 생성되었지만 ID가 없습니다",
    cannotConnect: "백엔드에 연결할 수 없습니다. 배포 또는 실행 상태를 확인해 주세요.",
    failedSaveDraft: "초안을 저장하지 못했습니다",
    storyLoading: "스토리 정보를 불러오는 중입니다.",
    failedUpdateStoryInfo: "스토리 정보를 업데이트하지 못했습니다.",
    missingEpisodeId: "에피소드 ID가 없습니다. 창을 닫고 다시 다음을 눌러 주세요.",
    chooseSchedule: "예약 날짜와 시간을 선택해 주세요.",
    failedSavePublish: "게시 설정을 저장하지 못했습니다.",
    goBack: "뒤로",
    next: "다음",
    loadingEpisodeData: "에피소드 데이터 불러오는 중...",
    mangaPages: "Manga 페이지",
    mangaPickHelp: "한 번에 최대 30개 이미지를 선택할 수 있습니다. 이미지당 최대 2 MB, 에피소드당 최대 100페이지입니다.",
    mangaFileTypes: "JPG, PNG, WebP, HEIC 또는 HEIF · 한 번에 최대 30개",
    mangaDraftHelp: "페이지 없이도 초안을 저장할 수 있습니다. 게시 전 최소 {{count}}페이지를 추가하세요.",
    mangaReady: "Manga 페이지가 준비되었습니다. 화살표로 읽기 순서를 확인하세요.",
    dropOrAddManga: "Manga 페이지 놓기 또는 추가",
    uploadingPages: "페이지 업로드 중...",
    insertImage: "이미지 삽입",
    aiSpace: "AI 공간",
    youtubeVideo: "YouTube 동영상",
    findReplace: "찾기 및 바꾸기",
    startWriting: "에피소드 작성을 시작하세요...",
    mangaInfo: "Manga 정보",
    storyInfo: "스토리 정보",
    pageCount: "{{count}}페이지",
    characterCount: "{{count}} / {{minimum}}자",
    saved: "저장됨",
    saveCountdown: "{{seconds}}초 후 저장",
    failedUploadImage: "이미지 업로드 실패",
    heicEmpty: "HEIC 변환 결과가 비어 있습니다.",
    heicConversionFailed: "이 기기에서 HEIC/HEIF 이미지를 변환하지 못했습니다. [convert: HEIC_CONVERSION_FAILED]",
    couldNotReadImage: "이미지를 읽을 수 없습니다.",
    browserCompressFailed: "이 브라우저에서 이미지를 압축할 수 없습니다.",
    chooseImageFirst: "먼저 이미지를 선택하세요.",
    chooseImageFile: "이미지 파일을 선택하세요.",
    imageTooLarge: "이미지는 5 MB 이하이어야 합니다.",
    imageProcessingUnavailable: "이 브라우저에서는 이미지 처리를 사용할 수 없습니다.",
    compressLimit: "이미지를 500 KB 미만으로 압축하지 못했습니다.",
    selectedReadFailed: "이 기기에서 선택한 이미지를 읽을 수 없습니다. [read: IMAGE_FILE_READ_FAILED]",
    selectedEmpty: "선택한 이미지 크기가 0 bytes입니다. [read: IMAGE_FILE_EMPTY]",
    networkImageFailed: "네트워크 오류: 이미지를 서버로 전송할 수 없습니다. 연결을 확인하고 다시 시도하세요. [network: IMAGE_REQUEST_FAILED]",
    novelUploadFailed: "Novel 이미지 업로드에 실패했습니다.",
    imageUrlMissingServer: "업로드는 끝났지만 서버가 이미지 URL을 반환하지 않았습니다. [complete: IMAGE_URL_MISSING]",
    uploadCanceled: "업로드가 취소되었습니다.",
    failedLoadStory: "스토리를 불러오지 못했습니다",
    failedLoadEpisode: "에피소드를 불러오지 못했습니다",
    localDraftRestored: "로컬 초안을 복원했습니다.",
    processingStatus: "처리 중",
    mangaPageAlt: "Manga 페이지 {{number}}",
    dropMangaPages: "Manga 페이지를 여기에 놓으세요",
    storyTagGroupCharacters: "캐릭터",
    storyTagGroupRelationship: "관계",
    storyTagGroupPlot: "플롯",
    storyTagGroupSetting: "배경 및 세계",
    storyTagGroupMood: "분위기 및 테마",
    storyTagGroupLgbt: "LGBTQ+",
    undo: "실행 취소",
    redo: "다시 실행",
    bold: "굵게",
    italic: "기울임",
    alignLeft: "왼쪽 정렬",
    alignCenter: "가운데 정렬",
    alignRight: "오른쪽 정렬",
    publishStep: "게시",
    enterEpisodeTitlePrompt: "에피소드 제목 입력",
  },
})

const STORY_LANGUAGE_CODES = {
  Khmer: 'km',
  English: 'en',
  Chinese: 'zh',
  Japanese: 'ja',
  Korean: 'ko',
}

const STORY_TAG_GROUP_KEYS = {
  Characters: 'storyTagGroupCharacters',
  Relationship: 'storyTagGroupRelationship',
  Plot: 'storyTagGroupPlot',
  'Setting & World': 'storyTagGroupSetting',
  'Mood & Theme': 'storyTagGroupMood',
  'LGBTQ+': 'storyTagGroupLgbt',
}

function getStoryLanguageLabel(language) {
  const code = STORY_LANGUAGE_CODES[language]
  if (!code || typeof Intl.DisplayNames === 'undefined') return language

  try {
    return new Intl.DisplayNames([getDisplayLanguageId()], {
      type: 'language',
    }).of(code) || language
  } catch {
    return language
  }
}

function getStoryTagGroupLabel(group) {
  const key = STORY_TAG_GROUP_KEYS[group]
  return key ? getDisplayText(`episodeEditor.${key}`) : group
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MIN_CHARACTERS = 1500
const MAX_CHARACTERS = 30000
const MAX_EDITOR_HISTORY = 100
const EDITOR_HISTORY_GROUP_MS = 1000
const LOCAL_AUTOSAVE_INTERVAL_SECONDS = 10
const SERVER_CHECKPOINT_MINUTES = 10
const STORY_LANGUAGES = ['Khmer', 'English', 'Chinese', 'Japanese', 'Korean']
const FALLBACK_GENRES = ['Romance', 'Fantasy', 'Action', 'Adventure', 'Comedy', 'Drama']
const STORY_TAG_GROUPS = [
  {
    name: 'Characters',
    tags: [
      'CEO',
      'Strong Female Lead',
      'Cold Male Lead',
      'Hidden Identity',
      'Royalty',
      'Villain',
      'Mafia',
      'Vampire',
    ],
  },
  {
    name: 'Relationship',
    tags: [
      'Slow Burn',
      'Enemies to Lovers',
      'Age Gap',
      'Childhood Sweetheart',
      'Second Chance',
      'Contract Marriage',
      'Love After Marriage',
      'Forbidden Love',
    ],
  },
  {
    name: 'Plot',
    tags: [
      'Revenge',
      'Time Travel',
      'Rebirth',
      'Mystery',
      'Adventure',
      'Action',
      'Tragic',
      'Fated',
    ],
  },
  {
    name: 'Setting & World',
    tags: [
      'School Life',
      'Historical',
      'Modern Fantasy',
      'Ancient Romance',
      'Supernatural',
      'Magic',
      'Sci-Fi',
      'Urban Romance',
    ],
  },
  {
    name: 'Mood & Theme',
    tags: [
      'Sweet',
      'Dark Romance',
      'Comedy',
      'Healing',
      'Emotional',
      'Suspense',
      'Family',
      'Friendship',
    ],
  },
  {
    name: 'LGBTQ+',
    tags: [
      'Boys’ Love',
      'Girls’ Love',
      'Omegaverse',
      'LGBTQ+',
    ],
  },
]

const STORY_TAG_OPTIONS = STORY_TAG_GROUPS.flatMap(
  (group) => group.tags
)

const UPDATE_DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    array[index] = binary.charCodeAt(index)
  }

  return new File([array], fileName, { type: mime })
}

async function uploadImageToStorage({ token, imageDataUrl, folder, fileName }) {
  if (!imageDataUrl) return null
  if (String(imageDataUrl).startsWith('http')) return imageDataUrl

  const file = dataUrlToFile(imageDataUrl, fileName)
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('episodeEditor.failedUploadImage'))
  }

  return data.image_url || data.imageUrl
}

function escapeEpisodeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function isSafeEpisodeImageUrl(value) {
  const source = String(value || '').trim()
  if (!source) return false

  try {
    const url = new URL(source, window.location.origin)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function sanitizeEpisodeHtml(value) {
  const source = String(value || '')
  if (!source.trim()) return ''
  if (typeof DOMParser === 'undefined') return escapeEpisodeHtml(source)

  const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
  const inputRoot = parsed.body.firstElementChild
  const outputDocument = document.implementation.createHTMLDocument('')
  const outputRoot = outputDocument.createElement('div')

  const appendSafeNode = (inputNode, outputParent) => {
    if (inputNode.nodeType === Node.TEXT_NODE) {
      outputParent.appendChild(outputDocument.createTextNode(inputNode.textContent || ''))
      return
    }

    if (inputNode.nodeType !== Node.ELEMENT_NODE) return

    const tagName = inputNode.tagName.toLowerCase()

    if (tagName === 'br') {
      outputParent.appendChild(outputDocument.createElement('br'))
      return
    }

    if (tagName === 'img') {
      const sourceUrl = inputNode.getAttribute('src')
      if (!isSafeEpisodeImageUrl(sourceUrl)) return
      const image = outputDocument.createElement('img')
      image.setAttribute('src', new URL(sourceUrl, window.location.origin).href)
      image.setAttribute('alt', String(inputNode.getAttribute('alt') || 'Episode image').slice(0, 200))
      outputParent.appendChild(image)
      return
    }

    const safeTag =
      tagName === 'b' || tagName === 'strong'
        ? 'strong'
        : tagName === 'i' || tagName === 'em'
          ? 'em'
          : tagName === 'p' || tagName === 'div'
            ? 'p'
            : null

    if (!safeTag) {
      Array.from(inputNode.childNodes).forEach((child) => appendSafeNode(child, outputParent))
      return
    }

    const outputElement = outputDocument.createElement(safeTag)

    if (safeTag === 'p') {
      const alignment = String(inputNode.style?.textAlign || inputNode.getAttribute('align') || '').toLowerCase()
      if (['left', 'center', 'right'].includes(alignment)) {
        outputElement.style.textAlign = alignment
      }
    }

    Array.from(inputNode.childNodes).forEach((child) => appendSafeNode(child, outputElement))
    outputParent.appendChild(outputElement)
  }

  Array.from(inputRoot?.childNodes || []).forEach((child) => appendSafeNode(child, outputRoot))
  return outputRoot.innerHTML
}

function plainTextToEpisodeHtml(value) {
  const source = String(value || '').replace(/\r\n/g, '\n').trim()
  if (!source) return ''

  return source
    .split(/\n\s*\n+/)
    .map((paragraph) => `<p>${escapeEpisodeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function normalizeEpisodeHtml(value) {
  const source = String(value || '')
  if (!source.trim()) return ''
  return /<(?:p|div|br|strong|b|em|i|img)\b/i.test(source)
    ? sanitizeEpisodeHtml(source)
    : plainTextToEpisodeHtml(source)
}

function episodeHtmlToPlainText(value) {
  const source = String(value || '')
  if (!source.trim()) return ''
  if (typeof DOMParser === 'undefined') return source.replace(/<[^>]+>/g, ' ')

  const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
  const root = parsed.body.firstElementChild
  if (!root) return ''

  const parts = []
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      if (text.trim()) parts.push(text)
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE || node.tagName === 'IMG') return
    const text = node.textContent || ''
    if (text.trim()) parts.push(text)
  })

  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim()
}

function hasEpisodeContent(value) {
  const source = String(value || '')
  return Boolean(episodeHtmlToPlainText(source).trim() || /<img\b[^>]*src=/i.test(source))
}

function cleanEpisodeHtmlSpacing(value) {
  const safeHtml = sanitizeEpisodeHtml(value)
  if (!safeHtml) return ''

  const parsed = new DOMParser().parseFromString(`<div>${safeHtml}</div>`, 'text/html')
  const root = parsed.body.firstElementChild
  const blocks = []

  Array.from(root?.childNodes || []).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = String(node.textContent || '').trim()
      if (text) blocks.push({ html: escapeEpisodeHtml(text), text, alignment: 'left' })
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return

    if (node.tagName === 'IMG' || node.querySelector?.('img')) {
      blocks.push({ html: node.outerHTML, text: '', image: true, alignment: 'left' })
      return
    }

    const text = String(node.textContent || '').replace(/\s+/g, ' ').trim()
    const alignment = ['left', 'center', 'right'].includes(String(node.style?.textAlign || '').toLowerCase())
      ? String(node.style.textAlign).toLowerCase()
      : 'left'

    if (!text) {
      blocks.push({ empty: true })
      return
    }

    blocks.push({ html: node.innerHTML.trim(), text, alignment })
  })

  const output = []
  let buffer = null

  const flush = () => {
    if (!buffer) return
    const alignmentStyle = buffer.alignment === 'left' ? '' : ` style="text-align: ${buffer.alignment}"`
    output.push(`<p${alignmentStyle}>${buffer.html}</p>`)
    buffer = null
  }

  blocks.forEach((block) => {
    if (block.empty) {
      flush()
      return
    }

    if (block.image) {
      flush()
      output.push(block.html)
      return
    }

    if (!buffer) {
      buffer = { ...block }
      return
    }

    if (
      block.alignment !== buffer.alignment ||
      isDialogueOrSpecialLine(block.text) ||
      endsWithSentencePunctuation(buffer.text)
    ) {
      flush()
      buffer = { ...block }
      return
    }

    buffer.html = `${buffer.html} ${block.html}`
    buffer.text = `${buffer.text} ${block.text}`
  })

  flush()
  return sanitizeEpisodeHtml(output.join(''))
}

const NOVEL_IMAGE_INPUT_MAX_BYTES = 5 * 1024 * 1024
const NOVEL_IMAGE_TARGET_MAX_BYTES = 300 * 1024
const NOVEL_IMAGE_HARD_MAX_BYTES = 500 * 1024
const NOVEL_IMAGE_MAX_COUNT = 2
const NOVEL_IMAGE_WIDTHS = [1600, 1360, 1120, 960]
const NOVEL_IMAGE_QUALITIES = [0.86, 0.8, 0.74, 0.7]

function countEpisodeImages(value) {
  const source = String(value || '')
  if (!source.trim()) return 0
  if (typeof DOMParser === 'undefined') {
    return (source.match(/<img\b/gi) || []).length
  }

  const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
  return parsed.body.querySelectorAll('img').length
}

function isNovelImageFile(file) {
  const type = String(file?.type || '').toLowerCase()
  const name = String(file?.name || '').toLowerCase()
  return type.startsWith('image/') || /\.(jpe?g|png|webp|gif|avif|hei[cf])$/i.test(name)
}

function isNovelHeicFile(file) {
  return /image\/hei[cf]/i.test(file?.type || '') || /\.hei[cf]$/i.test(file?.name || '')
}

async function convertNovelHeicForUpload(file) {
  try {
    const { heicTo } = await import('heic-to')
    const blob = await heicTo({
      blob: file,
      type: 'image/jpeg',
      quality: 0.9,
    })

    if (!(blob instanceof Blob) || !blob.size) {
      throw new Error(getDisplayText('episodeEditor.heicEmpty'))
    }

    const base = String(file.name || 'episode-image').replace(/\.[^.]+$/, '')
    const jpegFile = new File([blob], `${base}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })

    return await optimizeNovelEpisodeImage(jpegFile)
  } catch {
    throw new Error(
      getDisplayText('episodeEditor.heicConversionFailed')
    )
  }
}


function loadNovelImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => resolve({ image, url })
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(getDisplayText('episodeEditor.couldNotReadImage')))
    }

    image.src = url
  })
}

function canvasToNovelWebp(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(getDisplayText('episodeEditor.browserCompressFailed')))
          return
        }

        resolve(blob)
      },
      'image/webp',
      quality
    )
  })
}

function novelWebpName(name = 'episode-image') {
  const base = String(name)
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base || 'episode-image'}.webp`
}

function chooseBestNovelImage(candidates) {
  return [...candidates].sort(
    (first, second) =>
      second.quality * second.width - first.quality * first.width
  )[0] || null
}

async function optimizeNovelEpisodeImage(file) {
  if (!file) throw new Error(getDisplayText('episodeEditor.chooseImageFirst'))
  if (!isNovelImageFile(file)) {
    throw new Error(getDisplayText('episodeEditor.chooseImageFile'))
  }
  if (file.size > NOVEL_IMAGE_INPUT_MAX_BYTES) {
    throw new Error(getDisplayText('episodeEditor.imageTooLarge'))
  }

  const loaded = await loadNovelImage(file)
  const targetCandidates = []
  const fallbackCandidates = []
  const usedWidths = new Set()

  try {
    for (const maxWidth of NOVEL_IMAGE_WIDTHS) {
      const width = Math.min(maxWidth, loaded.image.naturalWidth)
      if (!width || usedWidths.has(width)) continue
      usedWidths.add(width)

      const ratio = width / loaded.image.naturalWidth
      const height = Math.max(1, Math.round(loaded.image.naturalHeight * ratio))
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error(getDisplayText('episodeEditor.imageProcessingUnavailable'))
      }

      canvas.width = width
      canvas.height = height
      context.drawImage(loaded.image, 0, 0, width, height)

      for (const quality of NOVEL_IMAGE_QUALITIES) {
        const blob = await canvasToNovelWebp(canvas, quality)
        const candidate = { blob, width, height, quality }

        if (blob.size <= NOVEL_IMAGE_HARD_MAX_BYTES) {
          fallbackCandidates.push(candidate)
        }
        if (blob.size <= NOVEL_IMAGE_TARGET_MAX_BYTES) {
          targetCandidates.push(candidate)
        }
      }

      canvas.width = 0
      canvas.height = 0
    }

    const selected =
      chooseBestNovelImage(targetCandidates) ||
      chooseBestNovelImage(fallbackCandidates)

    if (!selected) {
      throw new Error(getDisplayText('episodeEditor.compressLimit'))
    }

    return new File([selected.blob], novelWebpName(file.name), {
      type: 'image/webp',
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(loaded.url)
  }
}

async function uploadEpisodeInlineImage({ token, file }) {
  if (!file) throw new Error(getDisplayText('episodeEditor.chooseImageFirst'))
  if (!isNovelImageFile(file)) {
    throw new Error(getDisplayText('episodeEditor.chooseImageFile'))
  }
  if (file.size > NOVEL_IMAGE_INPUT_MAX_BYTES) {
    throw new Error(getDisplayText('episodeEditor.imageTooLarge'))
  }

  let response
let bytes

try {
  bytes = await file.arrayBuffer()
} catch {
  throw new Error(getDisplayText('episodeEditor.selectedReadFailed'))
}

if (!bytes.byteLength) {
  throw new Error(getDisplayText('episodeEditor.selectedEmpty'))
}

try {
  response = await fetch(
      `${API_BASE_URL}/api/story-media/upload-novel-image`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: bytes,
      }
    )
  } catch {
    throw new Error(
      getDisplayText('episodeEditor.networkImageFailed')
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    const stage = String(data.stage || 'upload')
    const code = String(data.code || `HTTP_${response.status}`)
    const message = data.message || getDisplayText('episodeEditor.novelUploadFailed')
    throw new Error(`${message} [${stage}: ${code}]`)
  }

  const imageUrl = data.image_url || data.imageUrl

  if (!imageUrl) {
    throw new Error(
      getDisplayText('episodeEditor.imageUrlMissingServer')
    )
  }

  return imageUrl
}



function isDialogueOrSpecialLine(line) {
  const text = String(line || '').trim()
  if (!text) return false
  return /^[“"‘'«—–-]/.test(text) || /^(\d+[\.)]|[•*])\s+/.test(text)
}

function endsWithSentencePunctuation(line) {
  return /[។.!?…]"?$/.test(String(line || '').trim())
}

function cleanBrokenParagraphs(value) {
  const lines = String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\u00A0/g, ' ')
    .split('\n')

  const output = []
  let buffer = []

  const flushBuffer = () => {
    if (!buffer.length) return
    output.push(buffer.join(' ').replace(/\s+/g, ' ').trim())
    buffer = []
  }

  lines.forEach((line) => {
    const text = line.trim()

    if (!text) {
      flushBuffer()
      if (output[output.length - 1] !== '') output.push('')
      return
    }

    if (isDialogueOrSpecialLine(text)) {
      flushBuffer()
      output.push(text)
      return
    }

    if (buffer.length && endsWithSentencePunctuation(buffer[buffer.length - 1])) {
      flushBuffer()
    }

    buffer.push(text)
  })

  flushBuffer()
  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function makeLocalId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function mangaPartsPatch(page) {
  return Object.prototype.hasOwnProperty.call(page || {}, 'parts')
    ? { parts: Array.isArray(page.parts) ? page.parts : [] }
    : {}
}

function getTemporaryMangaPartUrls(pages = []) {
  return [
    ...new Set(
      (Array.isArray(pages) ? pages : [])
        .flatMap((page) =>
          Array.isArray(page?.parts) ? page.parts : []
        )
        .map((part) =>
          String(part?.image_url || part?.imageUrl || '').trim()
        )
        .filter((url) => url && url.includes('/manga-v2/'))
    ),
  ]
}

async function cleanupTemporaryMangaPages(pages = []) {
  const token = getAuthToken()
  const urls = getTemporaryMangaPartUrls(pages)

  if (!token || !urls.length) return

  for (let index = 0; index < urls.length; index += 10) {
    const chunk = urls.slice(index, index + 10)

    try {
      await fetch(
        `${API_BASE_URL}/api/story-media/cleanup-manga-page-v2`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ urls: chunk }),
        }
      )
    } catch {
    }
  }
}

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
          active ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]' : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
        }`}
      >
        {number}
      </div>
      <div className={`line-clamp-1 text-[12px] font-extrabold ${active ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'}`}>
        {title}
      </div>
    </div>
  )
}

function ToolButton({ Icon, label, onClick, active = false, disabled = false }) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className="flex h-10 w-10 shrink-0 items-center justify-center active:scale-95 disabled:opacity-40"
      aria-label={label}
      title={label}
    >
      <Icon
        size={19}
        strokeWidth={1.7}
        className={active ? 'text-[#FE526E]' : 'text-[var(--shadow-text-primary)]'}
      />
    </button>
  )
}

function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed inset-0 z-[180] flex items-center justify-center bg-black/10 px-6"
    >
      <div className="max-w-[360px] rounded-[18px] bg-[var(--shadow-bg-surface)] px-5 py-4 text-center text-[14px] font-bold leading-6 text-[var(--shadow-text-primary)] shadow-2xl">
        {message}
      </div>
    </button>
  )
}

function UnsavedChangesModal({ open, onKeepEditing, onDiscard, onSaveDraft }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-2xl">
        <h2 className="text-[18px] font-bold text-[var(--shadow-text-primary)]">
  {getDisplayText('episodeEditor.unsavedChanges')}
</h2>
        <p className="mt-3 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
          {getDisplayText('episodeEditor.unsavedHelp')}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onKeepEditing}
            className="rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-2.5 text-[12px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
          >
            {getDisplayText('episodeEditor.keepEditing')}
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-full border border-[#f0b8b8] bg-[var(--shadow-bg-surface)] px-3 py-2.5 text-[12px] font-normal text-[#c04444] active:scale-95"
          >
            {getDisplayText('episodeEditor.discard')}
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-full bg-[var(--shadow-text-primary)] px-3 py-2.5 text-[12px] font-normal text-[var(--shadow-bg-surface)] active:scale-95"
          >
            {getDisplayText('episodeEditor.saveDraft')}
          </button>
        </div>
      </div>
    </div>
  )
}

function LocalDraftRecoveryModal({
  open,
  busy,
  onDiscard,
  onRestore,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
          <i className="fa-solid fa-clock-rotate-left text-[21px]" />
        </div>

        <h2 className="mt-4 text-[18px] font-bold text-[var(--shadow-text-primary)]">
          {getDisplayText('episodeEditor.localDraftFound')}
        </h2>

        <p className="mt-3 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
          {getDisplayText('episodeEditor.localDraftHelp')}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onDiscard}
            disabled={busy}
            className="h-11 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 text-[12px] font-normal text-[var(--shadow-text-secondary)] active:scale-95 disabled:opacity-50"
          >
            {getDisplayText('episodeEditor.discardLocal')}
          </button>

          <button
            type="button"
            onClick={onRestore}
            disabled={busy}
            className="h-11 rounded-full bg-[var(--shadow-text-primary)] px-3 text-[12px] font-bold text-[var(--shadow-bg-surface)] active:scale-95 disabled:opacity-50"
          >
            {busy ? getDisplayText('episodeEditor.pleaseWait') : getDisplayText('episodeEditor.restoreDraft')}
          </button>
        </div>
      </div>
    </div>
  )
}

function CleanParagraphsModal({ open, onCancel, onClean }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[155] flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
          <i className="fa-solid fa-wand-magic-sparkles text-[22px]" />
        </div>
        <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('episodeEditor.cleanQuestion')}</h2>
        <p className="mt-3 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
          {getDisplayText('episodeEditor.cleanHelp')}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-95"
          >
            {getDisplayText('episodeEditor.cancel')}
          </button>
          <button
            type="button"
            onClick={onClean}
            className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-surface)] active:scale-95"
          >
            {getDisplayText('episodeEditor.clean')}
          </button>
        </div>
      </div>
    </div>
  )
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', reject)
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return imageSrc

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return canvas.toDataURL('image/jpeg', 0.9)
}

function CropCoverModal({
  open,
  image,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center overflow-hidden bg-black/50 px-4">
      <div className="w-full max-w-[560px] rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('episodeEditor.cropCover')}</h2>
            <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-tertiary)]">
              {getDisplayText('episodeEditor.cropHelp')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]"
            aria-label={getDisplayText('episodeEditor.closeCrop')}
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="relative h-[240px] touch-none overflow-hidden rounded-[20px] bg-[#111827] sm:h-[310px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            showGrid={false}
            restrictPosition={false}
            objectFit="horizontal-cover"
          />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[var(--shadow-text-secondary)]">
            <span>{getDisplayText('episodeEditor.zoom')}</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
            className="w-full accent-[var(--shadow-text-primary)]"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-95"
          >
            {getDisplayText('episodeEditor.cancel')}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-surface)] active:scale-95"
          >
            {getDisplayText('episodeEditor.saveCrop')}
          </button>
        </div>
      </div>
    </div>
  )
}


function EpisodeDetailsSheet({
  open,
  title,
  cover,
  onTitleChange,
  onCoverChange,
  onRemoveCover,
  onClose,
  onSave,
}) {
  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousHtmlOverflow = html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      html.style.overflow = previousHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  const canSave = Boolean(title.trim())


  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center bg-black/35 sm:px-4"
      onClick={onClose}
    >
      <div className="w-full sm:max-w-5xl">
        <div
          className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[18px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:max-h-[82dvh] sm:rounded-[12px] sm:px-5 sm:pb-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="w-full">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
                aria-label={getDisplayText('episodeEditor.closeEpisodeDetails')}
              >
                <i className="fa-solid fa-xmark text-[14px]" />
              </button>

              <h2 className="min-w-0 flex-1 truncate text-center text-[14px] font-bold text-[var(--shadow-text-primary)]">
                {getDisplayText('episodeEditor.episodeDetails')}
              </h2>

              <button
                type="button"
                onClick={onSave}
                disabled={!canSave}
                className="h-8 shrink-0 rounded-full bg-[var(--shadow-text-primary)] px-4 text-[12px] font-bold text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)]"
              >
                {getDisplayText('episodeEditor.save')}
              </button>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[13px] font-semibold text-[var(--shadow-text-primary)]">
                {getDisplayText('episodeEditor.episodeTitle')} <span className="text-[#e5484d]">*</span>
              </label>

              <input
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
                maxLength={200}
                autoFocus
                placeholder={getDisplayText('episodeEditor.enterEpisodeTitle')}
                className="h-12 w-full rounded-[10px] bg-[var(--shadow-bg-soft)] px-3 text-[14px] font-semibold text-[var(--shadow-text-primary)] outline-none placeholder:font-semibold placeholder:text-[var(--shadow-placeholder)]"
              />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('episodeEditor.episodeCover')}
                </div>

                <div className="text-[11px] text-[var(--shadow-text-tertiary)]">
                  {getDisplayText('episodeEditor.optional')}
                </div>
              </div>

              <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">
                {getDisplayText('episodeEditor.coverHelp')}
              </p>

              {cover ? (
                <div className="mt-3 overflow-hidden rounded-[12px] bg-[var(--shadow-bg-soft)]">
                  <div className="aspect-video w-full overflow-hidden sm:h-[340px] sm:aspect-auto">
                    <img
                      src={cover}
                      alt={getDisplayText('episodeEditor.episodeCover')}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3">
                    <label className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[12px] font-bold text-[var(--shadow-bg-surface)] active:scale-95">
                      {getDisplayText('episodeEditor.replace')}

                      <input
                        type="file"
                        accept="image/*,.heic,.heif"
                        className="hidden"
                        onChange={(event) => {
                          onCoverChange(event.target.files?.[0] || null)
                          event.target.value = ''
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={onRemoveCover}
                      className="flex h-10 flex-1 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[12px] font-bold text-[var(--shadow-text-secondary)] active:scale-95"
                    >
                      {getDisplayText('episodeEditor.remove')}
                    </button>
                  </div>
                </div>
              ) : (
                <label className="mt-3 flex aspect-video cursor-pointer flex-col items-center justify-center rounded-[12px] bg-[var(--shadow-bg-soft)] text-center active:scale-[0.99] sm:h-[340px] sm:aspect-auto">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm">
                    <i className="fa-regular fa-image text-[14px]" />
                  </div>

                  <div className="mt-3 text-[13px] font-bold text-[var(--shadow-text-primary)]">
                    {getDisplayText('episodeEditor.addEpisodeCover')}
                  </div>

                  <div className="mt-1 text-[11px] text-[var(--shadow-text-tertiary)]">
                    {getDisplayText('episodeEditor.crop169')}
                  </div>

                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    className="hidden"
                    onChange={(event) => {
                      onCoverChange(event.target.files?.[0] || null)
                      event.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SettingsToggle({
  checked,
  onClick,
  label,
  activeColor = '#FE526E',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: checked
          ? activeColor
          : 'var(--shadow-border-strong)',
      }}
      className="relative h-7 w-12 shrink-0 rounded-full transition-all duration-200 active:scale-95"
      aria-label={label}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-[var(--shadow-bg-surface)] shadow-sm transition-all duration-200 ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}


export function GenreSheet({
  open,
  value,
  options = FALLBACK_GENRES,
  loading = false,
  onClose,
  onSave,
}) {
  useDisplayTranslation()
  const [selected, setSelected] = useState(value || 'Romance')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open) return
    setSelected(value || 'Romance')
    setSearch('')
  }, [open, value])

  if (!open) return null

  const visibleGenres = options.filter((genre) =>
    genre.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-[190] overflow-y-auto bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-10 bg-[var(--shadow-bg-surface)] px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={getDisplayText('episodeEditor.backToPublish')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('episodeEditor.addGenre')}
          </h2>

          <button
            type="button"
            onClick={() => onSave(selected)}
            className="text-[14px] font-bold text-[#0b5cff]"
          >
            {getDisplayText('episodeEditor.save')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-5 flex h-12 items-center rounded-full bg-[var(--shadow-bg-surface)] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[var(--shadow-text-tertiary)]" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={getDisplayText('episodeEditor.searchGenre')}
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>

        <div className="mb-5">
          <div className="text-[14px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('episodeEditor.genreHelp')}
          </div>

          <div className="mt-2 text-[12px] text-[var(--shadow-text-secondary)]">
            {getDisplayText('episodeEditor.oneGenre')}
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-[13px] text-[var(--shadow-text-tertiary)]">
            {getDisplayText('episodeEditor.loadingGenres')}
          </div>
        ) : null}

        {!loading && visibleGenres.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-[var(--shadow-text-tertiary)]">
            {getDisplayText('episodeEditor.noGenres')}
          </div>
        ) : null}

        {!loading ? (
          <div className="grid grid-cols-2 gap-3">
            {visibleGenres.map((genre) => {
              const active = selected === genre

              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelected(genre)}
                  className={`flex h-[76px] items-center justify-center rounded-[12px] px-3 text-center text-[14px] font-bold transition active:scale-[0.98] ${
                    active
                      ? 'border-2 border-[#FE526E] bg-[var(--shadow-bg-surface)] text-[#FE526E]'
                      : 'border border-transparent bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]'
                  }`}
                >
                  {genre}
                </button>
              )
            })}
          </div>
        ) : null}
      </main>
    </div>
  )
}

export function TagSheet({ open, value, onClose, onSave }) {
  useDisplayTranslation()
  const [selected, setSelected] = useState(value || [])
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState('All')
  const [customOpen, setCustomOpen] = useState(false)
  const [customTag, setCustomTag] = useState('')

  useEffect(() => {
    if (!open) return

    setSelected(value || [])
    setSearch('')
    setActiveGroup('All')
    setCustomOpen(false)
    setCustomTag('')
  }, [open, value])

  if (!open) return null

  const toggleTag = (tag) => {
    setSelected((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag)
      }

      if (current.length >= 6) return current

      return [...current, tag]
    })
  }

  const addCustom = () => {
    const tag = customTag.trim()
    const exists = selected.some(
      (item) => item.toLowerCase() === tag.toLowerCase()
    )

    if (!tag || exists || selected.length >= 6) return

    setSelected((current) => [...current, tag])
    setCustomTag('')
    setCustomOpen(false)
  }

  const query = search.trim().toLowerCase()

  const visibleGroups = STORY_TAG_GROUPS
    .filter(
      (group) =>
        activeGroup === 'All' || group.name === activeGroup
    )
    .map((group) => ({
      ...group,
      tags: group.tags.filter((tag) =>
        tag.toLowerCase().includes(query)
      ),
    }))
    .filter((group) => group.tags.length > 0)

  return (
    <div className="fixed inset-0 z-[190] overflow-y-auto bg-[var(--shadow-bg-surface)]">
      <header className="sticky top-0 z-10 bg-[var(--shadow-bg-surface)] px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={getDisplayText('episodeEditor.backToPublish')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('episodeEditor.addTags')}
          </h2>

          <button
            type="button"
            onClick={() => onSave(selected)}
            className="text-[14px] font-normal text-[#0b5cff]"
          >
            {getDisplayText('episodeEditor.save')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="flex h-12 items-center rounded-full bg-[var(--shadow-bg-soft)] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[var(--shadow-placeholder)]" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={getDisplayText('episodeEditor.searchCustomTags')}
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none placeholder:font-normal placeholder:text-[var(--shadow-placeholder)]"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {['All', ...STORY_TAG_GROUPS.map((group) => group.name)].map(
            (group) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-normal ${
                  activeGroup === group
                    ? 'bg-[var(--shadow-bg-hover)] text-[var(--shadow-text-primary)]'
                    : 'bg-[var(--shadow-bg-page)] text-[var(--shadow-text-tertiary)]'
                }`}
              >
                {group === 'All' ? getDisplayText('episodeEditor.all') : getStoryTagGroupLabel(group)}
              </button>
            )
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[14px] font-normal text-[var(--shadow-text-primary)]">
              {getDisplayText('episodeEditor.selectedCount', { count: selected.length })}
            </div>

            <button
              type="button"
              onClick={() => setCustomOpen((current) => !current)}
              disabled={selected.length >= 6}
              className="rounded-full bg-[var(--shadow-text-primary)] px-4 py-2 text-[12px] font-normal text-[var(--shadow-bg-surface)] disabled:bg-[var(--shadow-bg-soft)]"
            >
              + {getDisplayText('episodeEditor.custom')}
            </button>
          </div>

          {customOpen ? (
            <div className="mt-3 flex items-center gap-2 rounded-[12px] bg-[var(--shadow-bg-soft)] p-2">
              <input
                value={customTag}
                onChange={(event) =>
                  setCustomTag(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addCustom()
                  }
                }}
                placeholder={getDisplayText('episodeEditor.writeCustomTag')}
                autoFocus
                className="h-10 min-w-0 flex-1 bg-transparent px-3 text-[13px] font-normal text-[var(--shadow-text-primary)] outline-none"
              />

              <button
                type="button"
                onClick={addCustom}
                disabled={
                  !customTag.trim() || selected.length >= 6
                }
                className="h-10 rounded-full bg-[var(--shadow-text-primary)] px-4 text-[12px] font-normal text-[var(--shadow-bg-surface)] disabled:bg-[var(--shadow-bg-soft)]"
              >
                {getDisplayText('episodeEditor.add')}
              </button>
            </div>
          ) : null}

          {selected.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="rounded-full bg-[#FFF1F3] px-4 py-2 text-[12px] font-normal text-[#FE526E]"
                >
                  {tag}
                  <span className="ml-2 text-[#FE526E]">×</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-7 space-y-7">
          {visibleGroups.map((group) => (
            <section key={group.name}>
              <h3 className="text-[15px] font-bold text-[var(--shadow-text-primary)]">
                {getStoryTagGroupLabel(group.name)}
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {group.tags.map((tag) => {
                  const active = selected.includes(tag)

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      disabled={!active && selected.length >= 6}
                      className={`rounded-full px-4 py-2 text-[12px] font-normal ${
                        active
  ? 'bg-[#FFF1F3] text-[#FE526E]'
  : 'bg-[var(--shadow-bg-page)] text-[var(--shadow-text-tertiary)]'
                      } disabled:opacity-40`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}

          {!visibleGroups.length ? (
            <div className="py-10 text-center text-[13px] font-normal text-[var(--shadow-text-tertiary)]">
              {getDisplayText('episodeEditor.noTags')}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export function LanguageWheelPicker({
  open,
  value,
  title = '',
  onClose,
  onSave,
}) {
  useDisplayTranslation()
  const listRef = useRef(null)
  const itemHeight = 48
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!open) return undefined

    const index = Math.max(
      0,
      STORY_LANGUAGES.indexOf(value)
    )

    setSelectedIndex(index)

    const frame = window.requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: index * itemHeight,
        behavior: 'auto',
      })
    })

    return () =>
      window.cancelAnimationFrame(frame)
  }, [open, value])

  if (!open) return null

  const selectedLanguage =
    STORY_LANGUAGES[selectedIndex] ||
    STORY_LANGUAGES[0]

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/35 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[320px] rounded-[18px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-2 text-[13px] text-[var(--shadow-text-secondary)]"
          >
            {getDisplayText('episodeEditor.cancel')}
          </button>

<h3 className="text-[12px] font-semibold text-[var(--shadow-text-primary)]">
  {title || getDisplayText('episodeEditor.storyLanguage')}
</h3>
          <button
            type="button"
            onClick={() =>
              onSave(selectedLanguage)
            }
            className="h-9 px-2 text-[13px] font-semibold text-[var(--shadow-text-primary)]"
          >
            {getDisplayText('episodeEditor.done')}
          </button>
        </div>

        <div className="relative mt-3 h-[192px] overflow-hidden">
          <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 h-12 -translate-y-1/2 rounded-[10px] bg-[var(--shadow-bg-soft)]" />

          <div
            ref={listRef}
            onScroll={(event) => {
              const index = Math.round(
                event.currentTarget.scrollTop /
                  itemHeight
              )

              setSelectedIndex(
                Math.max(
                  0,
                  Math.min(
                    STORY_LANGUAGES.length - 1,
                    index
                  )
                )
              )
            }}
            className="relative z-20 h-full snap-y snap-mandatory overflow-y-auto py-[72px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {STORY_LANGUAGES.map(
              (language, index) => {
                const active =
                  selectedIndex === index

                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(index)
                      listRef.current?.scrollTo({
                        top:
                          index * itemHeight,
                        behavior: 'smooth',
                      })
                    }}
                    className={`flex h-12 w-full snap-center items-center justify-center text-[15px] transition ${
                      active
                        ? 'font-semibold text-[var(--shadow-text-primary)]'
                        : 'font-normal text-[var(--shadow-text-tertiary)] opacity-40'
                    }`}
                  >
                    {getStoryLanguageLabel(language)}
                  </button>
                )
              }
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(to_bottom,var(--shadow-bg-surface)_0%,transparent_42%,transparent_58%,var(--shadow-bg-surface)_100%)]" />
        </div>
      </div>
    </div>
  )
}

export function AdultHintPopup({
  open,
  title,
  description,
  onClose,
}) {
  useDisplayTranslation()
  if (!open) return null

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/35 px-6"
      aria-label={getDisplayText('episodeEditor.closeInformation')}
    >
      <div className="pointer-events-none w-full max-w-[320px] rounded-[16px] bg-[var(--shadow-bg-surface)] px-5 py-5 text-center shadow-2xl">
        <div className="text-[15px] font-bold text-[var(--shadow-text-primary)]">
          {title}
        </div>

        <div className="mt-3 text-[12px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
          {description}
        </div>
      </div>
    </button>
  )
}

const RELEASE_OPTION_ITEMS = [
  {
    value: 'publish',
    titleKey: 'publishNow',
    subtitleKey: 'publishNowHelp',
  },
  {
    value: 'schedule',
    titleKey: 'schedule',
    subtitleKey: 'scheduleHelp',
  },
  {
    value: 'draft',
    titleKey: 'saveAsDraft',
    subtitleKey: 'saveAsDraftHelp',
  },
]

const RELEASE_OPTION_LABEL_KEYS = {
  publish: 'publishNow',
  schedule: 'schedule',
  draft: 'saveAsDraft',
}

function padScheduleNumber(value) {
  return String(value).padStart(2, '0')
}

function getScheduleDays(year, month) {
  return new Date(year, month, 0).getDate()
}

function formatScheduleLabel(date, time) {
  if (!date || !time) return getDisplayText('episodeEditor.chooseDateTime')

  const value = new Date(`${date}T${time}:00`)

  if (Number.isNaN(value.getTime())) {
    return getDisplayText('episodeEditor.chooseDateTime')
  }

  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

function ReleaseOptionSheet({
  open,
  value,
  onClose,
  onSelect,
}) {
  useDisplayTranslation()
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[230] flex items-end bg-black/35 sm:items-center sm:justify-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[18px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-4 sm:max-w-[420px] sm:rounded-[18px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('episodeEditor.releaseOption')}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)]"
            aria-label={getDisplayText('episodeEditor.closeReleaseOptions')}
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="mt-3 space-y-1">
          {RELEASE_OPTION_ITEMS.map((option) => {
            const active = value === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[13px] ${
                      active
                        ? 'font-semibold text-[var(--shadow-text-primary)]'
                        : 'font-normal text-[var(--shadow-text-secondary)]'
                    }`}
                  >
                    {getDisplayText(`episodeEditor.${option.titleKey}`)}
                  </div>

                  <div className="mt-1 text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
                    {getDisplayText(`episodeEditor.${option.subtitleKey}`)}
                  </div>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active
                      ? 'border-[#FE526E] bg-[#FE526E] text-white'
                      : 'border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)]'
                  }`}
                >
                  {active ? (
                    <i className="fa-solid fa-check text-[9px]" />
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ScheduleWheelColumn({
  items,
  value,
  onChange,
  className = 'w-[52px]',
}) {
  const listRef = useRef(null)
  const itemHeight = 44

  useEffect(() => {
    const index = Math.max(
      0,
      items.findIndex(
        (item) => String(item.value) === String(value)
      )
    )

    const frame = window.requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: index * itemHeight,
        behavior: 'auto',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [items.length, value])

  return (
    <div className={`relative h-[132px] overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-11 -translate-y-1/2 rounded-[8px] bg-[var(--shadow-bg-soft)]" />

      <div
        ref={listRef}
        onScroll={(event) => {
          const index = Math.round(
            event.currentTarget.scrollTop / itemHeight
          )

          const safeIndex = Math.max(
            0,
            Math.min(items.length - 1, index)
          )

          onChange(items[safeIndex].value)
        }}
        className="relative z-20 h-full snap-y snap-mandatory overflow-y-auto py-11 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = String(item.value) === String(value)

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onChange(item.value)

                const index = items.findIndex(
                  (entry) =>
                    String(entry.value) === String(item.value)
                )

                listRef.current?.scrollTo({
                  top: index * itemHeight,
                  behavior: 'smooth',
                })
              }}
              className={`flex h-11 w-full snap-center items-center justify-center text-[14px] transition ${
                active
                  ? 'font-semibold text-[var(--shadow-text-primary)]'
                  : 'font-normal text-[var(--shadow-text-tertiary)] opacity-40'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(to_bottom,var(--shadow-bg-surface)_0%,transparent_40%,transparent_60%,var(--shadow-bg-surface)_100%)]" />
    </div>
  )
}

function ScheduleWheelPicker({
  open,
  date,
  time,
  onClose,
  onSave,
}) {
  useDisplayTranslation()
  const now = new Date()
  const defaultTime = new Date(Date.now() + 60 * 60 * 1000)

  const [year, setYear] = useState(defaultTime.getFullYear())
  const [month, setMonth] = useState(defaultTime.getMonth() + 1)
  const [day, setDay] = useState(defaultTime.getDate())
  const [hour, setHour] = useState(defaultTime.getHours())
  const [minute, setMinute] = useState(defaultTime.getMinutes())

  useEffect(() => {
    if (!open) return

    let initial =
      date && time
        ? new Date(`${date}T${time}:00`)
        : new Date(Date.now() + 60 * 60 * 1000)

    if (
      Number.isNaN(initial.getTime()) ||
      initial.getTime() <= Date.now()
    ) {
      initial = new Date(Date.now() + 60 * 60 * 1000)
    }

    initial.setSeconds(0, 0)

    setYear(initial.getFullYear())
    setMonth(initial.getMonth() + 1)
    setDay(initial.getDate())
    setHour(initial.getHours())
    setMinute(initial.getMinutes())
  }, [open, date, time])

  useEffect(() => {
    const maximumDay = getScheduleDays(year, month)

    if (day > maximumDay) {
      setDay(maximumDay)
    }
  }, [year, month, day])

  const years = useMemo(() => {
    const firstYear = now.getFullYear()
    const lastYear = Math.max(firstYear + 5, year)

    return Array.from(
      { length: lastYear - firstYear + 1 },
      (_, index) => {
        const value = firstYear + index
        return { value, label: String(value) }
      }
    )
  }, [year])

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: padScheduleNumber(index + 1),
      })),
    []
  )

  const days = useMemo(
    () =>
      Array.from(
        { length: getScheduleDays(year, month) },
        (_, index) => ({
          value: index + 1,
          label: padScheduleNumber(index + 1),
        })
      ),
    [year, month]
  )

  const hours = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        value: index,
        label: padScheduleNumber(index),
      })),
    []
  )

  const minutes = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => ({
        value: index,
        label: padScheduleNumber(index),
      })),
    []
  )

  if (!open) return null

  const selectedDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0
  )

  const isPast = selectedDate.getTime() <= Date.now()

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] rounded-[18px] bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-2 text-[13px] font-normal text-[var(--shadow-text-secondary)]"
          >
            {getDisplayText('episodeEditor.cancel')}
          </button>

          <h3 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('episodeEditor.scheduleRelease')}
          </h3>

          <button
            type="button"
            disabled={isPast}
            onClick={() =>
              onSave(
                `${year}-${padScheduleNumber(month)}-${padScheduleNumber(day)}`,
                `${padScheduleNumber(hour)}:${padScheduleNumber(minute)}`
              )
            }
            className="h-9 px-2 text-[13px] font-semibold text-[#FE526E] disabled:text-[var(--shadow-text-disabled)]"
          >
            {getDisplayText('episodeEditor.ok')}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <ScheduleWheelColumn
            items={years}
            value={year}
            onChange={setYear}
            className="w-[68px]"
          />

          <ScheduleWheelColumn
            items={months}
            value={month}
            onChange={setMonth}
          />

          <ScheduleWheelColumn
            items={days}
            value={day}
            onChange={setDay}
          />

          <ScheduleWheelColumn
            items={hours}
            value={hour}
            onChange={setHour}
          />

          <span className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
            :
          </span>

          <ScheduleWheelColumn
            items={minutes}
            value={minute}
            onChange={setMinute}
          />
        </div>

        <div className="mt-2 grid grid-cols-5 text-center text-[10px] font-normal text-[var(--shadow-text-tertiary)]">
          <span>{getDisplayText('episodeEditor.year')}</span>
          <span>{getDisplayText('episodeEditor.month')}</span>
          <span>{getDisplayText('episodeEditor.day')}</span>
          <span>{getDisplayText('episodeEditor.hour')}</span>
          <span>{getDisplayText('episodeEditor.minute')}</span>
        </div>

        {isPast ? (
          <div className="mt-3 text-center text-[11px] font-normal text-[#D92D20]">
            {getDisplayText('episodeEditor.futureDateTime')}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function PublishSettingsSheet({
  open,
  episodeTitle,
  showStorySettings,
  genreOptions,
  genresLoading = false,
  storyLanguage,
  onStoryLanguageChange,
  mainGenre,
  onMainGenreChange,
  storyTags,
  onStoryTagsChange,
  updateDays,
  onToggleUpdateDay,
  storyStatus,
  onStoryStatusChange,
  storyAdult,
  onStoryAdultChange,
  episodeAdult,
  onEpisodeAdultChange,
  episodeFree,
  onEpisodeFreeChange,
  releaseOption,
  onReleaseOptionChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange,
  saving,
  onClose,
  onSave,
  isChatStory = false,

}) {
  useDisplayTranslation()
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const dragStartY = useRef(0)
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false)
  const [activeHint, setActiveHint] = useState('')
  const [releasePickerOpen, setReleasePickerOpen] = useState(false)
  const [schedulePickerOpen, setSchedulePickerOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [open])

  useEffect(() => {
    if (open) return
    setDragY(0)
    setDragging(false)
    setGenreOpen(false)
    setTagOpen(false)
    setLanguagePickerOpen(false)
    setActiveHint('')
    setReleasePickerOpen(false)
    setSchedulePickerOpen(false)
  }, [open])

  const handleDragStart = (event) => {
    dragStartY.current = event.touches[0].clientY
    setDragging(true)
  }

  const handleDragMove = (event) => {
    const distance = event.touches[0].clientY - dragStartY.current
    setDragY(Math.max(0, distance))
  }

  const handleDragEnd = () => {
    if (dragY >= 90) {
      onClose()
    }

    setDragY(0)
    setDragging(false)
  }

  if (!open) return null

  if (genreOpen) {
    return (
      <GenreSheet
        open
        value={mainGenre}
        options={genreOptions}
        loading={genresLoading}
        onClose={() => setGenreOpen(false)}
        onSave={(genre) => {
          onMainGenreChange(genre)
          setGenreOpen(false)
        }}
      />
    )
  }

  if (tagOpen) {
    return (
      <TagSheet
        open
        value={storyTags}
        onClose={() => setTagOpen(false)}
        onSave={(tags) => {
          onStoryTagsChange(tags)
          setTagOpen(false)
        }}
      />
    )
  }

  const storyDetailsValid =
  !showStorySettings ||
  Boolean(
    storyLanguage?.trim() &&
    mainGenre?.trim() &&
    Array.isArray(storyTags) &&
    storyTags.length > 0
  )

const releaseOptionValid =
  releaseOption !== 'schedule' ||
  Boolean(scheduleDate && scheduleTime)

const canSave =
  storyDetailsValid &&
  releaseOptionValid &&
  !saving

  const tagSummary = storyTags.length
    ? storyTags.join(', ')
    : getDisplayText('episodeEditor.chooseTags')

  return (
    <>
      <AdultHintPopup
  open={activeHint === 'story-adult'}
  title={getDisplayText('episodeEditor.adultStory')}
  description={getDisplayText('episodeEditor.adultStoryHelp')}
  onClose={() => setActiveHint('')}
/>

<AdultHintPopup
  open={activeHint === 'episode-adult'}
  title={getDisplayText('episodeEditor.adultEpisode')}
  description={getDisplayText('episodeEditor.adultEpisodeHelp')}
  onClose={() => setActiveHint('')}
/>

      <AdultHintPopup
  open={activeHint === 'episode-free'}
  title={getDisplayText('episodeEditor.freeEpisode')}
  description={getDisplayText('episodeEditor.freeEpisodeHelp')}
  onClose={() => setActiveHint('')}
/>

      <ReleaseOptionSheet
  open={releasePickerOpen}
  value={releaseOption}
  onClose={() => setReleasePickerOpen(false)}
  onSelect={(option) => {
    setReleasePickerOpen(false)

    if (option === 'schedule') {
      setSchedulePickerOpen(true)
      return
    }

    onReleaseOptionChange(option)
  }}
/>

<ScheduleReleasePicker
  open={schedulePickerOpen}
  hideTrigger
  date={scheduleDate}
  time={scheduleTime}
  onDateChange={onScheduleDateChange}
  onTimeChange={onScheduleTimeChange}
  onClose={() => setSchedulePickerOpen(false)}
  onSave={(nextDate, nextTime) => {
    onScheduleDateChange(nextDate)
    onScheduleTimeChange(nextTime)
    onReleaseOptionChange('schedule')
    setSchedulePickerOpen(false)
  }}
/>

      
      <LanguageWheelPicker
        open={languagePickerOpen}
        value={storyLanguage}
        onClose={() => setLanguagePickerOpen(false)}
        onSave={(language) => {
          onStoryLanguageChange(language)
          setLanguagePickerOpen(false)
        }}
      />

      <div
        className="fixed inset-0 z-[175] flex items-end bg-black/35 sm:items-center sm:justify-center sm:px-4"
        onClick={onClose}
      >
        <div
          className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[18px] bg-[var(--shadow-bg-surface)] sm:max-w-[680px] sm:rounded-[18px] ${
            dragging ? '' : 'transition-transform duration-200'
          }`}
          style={{
            transform: `translateY(${dragY}px)`,
            willChange: 'transform',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div
  className="flex touch-none items-center justify-center bg-[var(--shadow-bg-surface)] px-4 py-3"
  onTouchStart={handleDragStart}
  onTouchMove={handleDragMove}
  onTouchEnd={handleDragEnd}
  onTouchCancel={handleDragEnd}
>
  <h2 className="text-center text-[15px] font-bold text-[var(--shadow-text-primary)]">
    {getDisplayText('episodeEditor.publish')}
  </h2>
</div>

          <div className="flex-1 overflow-y-auto bg-[var(--shadow-bg-surface)] px-4 py-4">
  <div
    className="mb-4 w-full min-w-0 truncate text-[14px] font-semibold text-[var(--shadow-text-primary)]"
    title={episodeTitle || ''}
  >
    {episodeTitle?.trim() || getDisplayText('episodeEditor.untitledEpisode')}
  </div>

  {showStorySettings ? (
    <section>
      <div>
                  <span className="mb-2 block text-[12px] font-semibold text-[var(--shadow-text-primary)]">
                    <span className="mr-1 text-[#e5484d]">*</span>{getDisplayText('episodeEditor.storyLanguage')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLanguagePickerOpen(true)}
                    className="flex h-11 w-full items-center rounded-[10px] bg-[var(--shadow-bg-soft)] pl-3 pr-2 text-left active:bg-[var(--shadow-bg-soft)]"
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--shadow-text-primary)]">
                      {storyLanguage ? getStoryLanguageLabel(storyLanguage) : getDisplayText('episodeEditor.chooseLanguage')}
                    </span>
                    <i className="fa-solid fa-chevron-right mr-1 shrink-0 text-[10px] text-[var(--shadow-text-tertiary)]" />
                  </button>
                </div>

                <div className="mt-4">
                  <span className="mb-2 block text-[12px] font-semibold text-[var(--shadow-text-primary)]">
                    <span className="mr-1 text-[#e5484d]">*</span>{getDisplayText('episodeEditor.mainGenre')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGenreOpen(true)}
                    className="flex h-11 w-full items-center rounded-[10px] bg-[var(--shadow-bg-soft)] px-3 text-left active:bg-[var(--shadow-bg-soft)]"
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--shadow-text-primary)]">
                      {mainGenre || getDisplayText('episodeEditor.chooseGenre')}
                    </span>
                    <i className="fa-solid fa-chevron-right mr-1 shrink-0 text-[10px] text-[var(--shadow-text-tertiary)]" />
                  </button>
                </div>

                <div className="mt-4">
                  <span className="mb-2 block text-[12px] font-semibold text-[var(--shadow-text-primary)]">
                    <span className="mr-1 text-[#e5484d]">*</span>{getDisplayText('episodeEditor.tags')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTagOpen(true)}
                    className="flex min-h-11 w-full items-center rounded-[10px] bg-[var(--shadow-bg-soft)] px-3 py-2.5 text-left active:bg-[var(--shadow-bg-soft)]"
                  >
                    <span
                      className={`min-w-0 flex-1 truncate text-[12px] ${
                        storyTags.length ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'
                      }`}
                    >
                      {tagSummary}
                    </span>
                    <span className="ml-3 shrink-0 text-[10.5px] text-[var(--shadow-text-tertiary)]">
                      {storyTags.length}/6
                    </span>
                    <i className="fa-solid fa-chevron-right ml-2 mr-1 shrink-0 text-[10px] text-[var(--shadow-text-tertiary)]" />
                  </button>
                </div>

                <div className="hidden mt-5">
  <div className="text-[12px] font-semibold text-[var(--shadow-text-primary)]">
    {getDisplayText('episodeEditor.updateDays')}
  </div>
                  <div className="mt-3 grid grid-cols-7 gap-1.5">
                    {UPDATE_DAY_OPTIONS.map((day) => {
                      const active = updateDays.includes(day)

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => onToggleUpdateDay(day)}
                          className={`h-9 rounded-[9px] text-[10.5px] ${
                            active
                              ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                              : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="hidden mt-5">
  <div className="text-[12px] font-semibold text-[var(--shadow-text-primary)]">
    {getDisplayText('episodeEditor.storyStatus')}
  </div>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className="text-[12px] font-normal text-[var(--shadow-text-primary)]">
                      {getDisplayText('episodeEditor.completed')}
                    </span>

                    <SettingsToggle
                      checked={storyStatus === 'Completed'}
                      onClick={() =>
                        onStoryStatusChange(
                          storyStatus === 'Completed' ? 'Ongoing' : 'Completed'
                        )
                      }
                      label={getDisplayText('episodeEditor.completed')}
                    />
                  </div>
                </div>

                <div className="hidden mt-5 items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-normal text-[var(--shadow-text-primary)]">
                      {getDisplayText('episodeEditor.adultStory')}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveHint('story-adult')}
                      className="flex h-5 w-5 items-center justify-center text-[var(--shadow-text-tertiary)]"
                      aria-label={getDisplayText('episodeEditor.aboutAdultStory')}
                    >
                      <i className="fa-regular fa-circle-question text-[13px]" />
                    </button>
                  </div>

                  <SettingsToggle
                    checked={storyAdult}
                    onClick={() => onStoryAdultChange(!storyAdult)}
                    label={getDisplayText('episodeEditor.toggleAdultStory')}
                  />
                </div>
              </section>
            ) : null}

            <section className={showStorySettings ? 'mt-7' : ''}>
             <h3 className="text-[12px] font-semibold text-[var(--shadow-text-primary)]">
  {getDisplayText('episodeEditor.episodeSettings')}
</h3>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-normal text-[var(--shadow-text-primary)]">
                    {getDisplayText('episodeEditor.adultEpisode')}
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveHint('episode-adult')}
                    className="flex h-5 w-5 items-center justify-center text-[var(--shadow-text-tertiary)]"
                    aria-label={getDisplayText('episodeEditor.aboutAdultEpisode')}
                  >
                    <i className="fa-regular fa-circle-question text-[13px]" />
                  </button>
                </div>

                <SettingsToggle
                  checked={episodeAdult}
                  onClick={() => onEpisodeAdultChange(!episodeAdult)}
                  label={getDisplayText('episodeEditor.toggleAdultEpisode')}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
  <div className="flex items-center gap-2">
    <span className="text-[12px] font-normal text-[var(--shadow-text-primary)]">
      {getDisplayText('episodeEditor.freeEpisode')}
    </span>

    <button
      type="button"
      onClick={() => setActiveHint('episode-free')}
      className="flex h-5 w-5 items-center justify-center text-[var(--shadow-text-tertiary)]"
      aria-label={getDisplayText('episodeEditor.aboutFreeEpisode')}
    >
      <i className="fa-regular fa-circle-question text-[13px]" />
    </button>
  </div>

  <SettingsToggle
    checked={episodeFree}
    onClick={() => onEpisodeFreeChange(!episodeFree)}
    label={getDisplayText('episodeEditor.toggleFreeEpisode')}
  />
</div>

              <div className="mt-5 space-y-1">
  <button
    type="button"
    onClick={() => setReleasePickerOpen(true)}
    className="flex w-full items-center justify-between gap-4 py-3 text-left"
  >
    <span className="text-[12px] font-normal text-[var(--shadow-text-primary)]">
      {getDisplayText('episodeEditor.releaseOption')}
    </span>

    <span className="flex min-w-0 items-center gap-3">
      <span className="truncate text-[12px] font-normal text-[var(--shadow-text-secondary)]">
        {getDisplayText(`episodeEditor.${RELEASE_OPTION_LABEL_KEYS[releaseOption] || 'publishNow'}`)}
      </span>

      <i className="fa-solid fa-chevron-right text-[10px] text-[var(--shadow-text-tertiary)]" />
    </span>
  </button>

  {releaseOption === 'schedule' ? (
    <button
      type="button"
      onClick={() => setSchedulePickerOpen(true)}
      className="flex w-full items-center justify-between gap-4 py-3 text-left"
    >
      <span className="text-[12px] font-normal text-[var(--shadow-text-primary)]">
        {getDisplayText('episodeEditor.releaseTime')}
      </span>

      <span className="flex min-w-0 items-center gap-3">
        <span className="truncate text-[12px] font-normal text-[var(--shadow-text-secondary)]">
          {formatScheduleLabel(scheduleDate, scheduleTime)}
        </span>

        <i className="fa-solid fa-chevron-right text-[10px] text-[var(--shadow-text-tertiary)]" />
      </span>
    </button>
  ) : null}
</div>
            </section>
          </div>

          <div className="shrink-0 bg-[var(--shadow-bg-surface)] px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className={`h-12 w-full rounded-full text-[13px] font-semibold active:scale-[0.99] disabled:bg-none disabled:bg-[var(--shadow-bg-soft)] ${
  isChatStory ? 'bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-white' : 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
}`}
            >
              {saving ? getDisplayText('episodeEditor.saving') : getDisplayText('episodeEditor.publish')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function MangaPageCard({ page, index, total, onMove, onDelete, onReplace, onRetry, disabled }) {
  const busy = ['queued', 'processing', 'uploading'].includes(page.status)
  const statusLabel =
    page.status === 'processing'
      ? page.serverProcessing
        ? getDisplayText('episodeEditor.processing')
        : getDisplayText('episodeEditor.compressing')
      : page.status === 'uploading'
        ? getDisplayText('episodeEditor.uploading')
        : page.status === 'error'
          ? getDisplayText('episodeEditor.uploadFailed')
          : getDisplayText('episodeEditor.ready')

  return (
    <ImageDropZone
      onFiles={(files) => onReplace(page.id, files[0] || null)}
      disabled={busy || disabled}
      className="rounded-[20px]"
      label={getDisplayText('episodeEditor.dropReplacement')}
    >
      <div className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden bg-[var(--shadow-bg-soft)]">
        <img src={page.previewUrl || page.imageUrl} alt={getDisplayText('episodeEditor.mangaPageAlt', { number: index + 1 })} className="h-full w-full object-contain" />
        {page.status === 'processing' && page.serverProcessing ? (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
    <i className="fa-solid fa-spinner animate-spin text-[28px] text-white drop-shadow-lg" />
  </div>
) : null}
        {page.status === 'error' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 px-4 text-center text-[12px] font-bold leading-5 text-white">
            {page.error || getDisplayText('episodeEditor.uploadFailed')}
          </div>
        ) : null}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className={`text-[11px] font-extrabold ${page.status === 'error' ? 'text-[#d92d20]' : 'text-[var(--shadow-text-secondary)]'}`}>
            {statusLabel}
          </div>
          <div className="text-[10px] font-bold text-[var(--shadow-text-tertiary)]">
            {page.fileSize ? formatFileSize(page.fileSize) : ''}
          </div>
        </div>

        {busy ? (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--shadow-border)]">
            <div className="h-full rounded-full bg-[#7c4dea] transition-all" style={{ width: `${page.progress || 5}%` }} />
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0 || disabled}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)] disabled:opacity-35"
            aria-label={getDisplayText('episodeEditor.movePageUp')}
          >
            <i className="fa-solid fa-arrow-up text-[11px]" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1 || disabled}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)] disabled:opacity-35"
            aria-label={getDisplayText('episodeEditor.movePageDown')}
          >
            <i className="fa-solid fa-arrow-down text-[11px]" />
          </button>
          <label className={`flex h-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-[#175cd3] ${disabled ? 'pointer-events-none opacity-35' : 'cursor-pointer'}`}>
            <i className="fa-solid fa-rotate text-[11px]" />
            <input
              type="file"
              accept="image/*,.heic,.heif"
              className="hidden"
              disabled={busy || disabled}
              onChange={(event) => {
                onReplace(page.id, event.target.files?.[0] || null)
                event.target.value = ''
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => onDelete(page.id)}
            disabled={busy}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[#fff1f1] text-[#d92d20] disabled:opacity-35"
            aria-label={getDisplayText('episodeEditor.deletePage')}
          >
            <i className="fa-solid fa-trash text-[11px]" />
          </button>
        </div>

        {page.status === 'error' ? (
          <button
            type="button"
            onClick={() => onRetry(page.id)}
            disabled={!page.sourceFile || disabled}
            className="mt-2 h-9 w-full rounded-[12px] bg-[var(--shadow-text-primary)] text-[11px] font-extrabold text-[var(--shadow-bg-surface)] disabled:bg-[var(--shadow-bg-soft)]"
          >
            {getDisplayText('episodeEditor.retryUpload')}
          </button>
        ) : null}
      </div>
    </div>
    </ImageDropZone>
  )
}

export default function EpisodeEditorPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || `/author/story/${storyId}/manage`
  const requestedType = searchParams.get('type') === 'manga' ? 'manga' : 'novel'
  const editEpisodeId = searchParams.get('editEpisodeId')
  const isEditMode = Boolean(editEpisodeId)
  const isFirstEpisode = searchParams.get('first') !== '0' && !isEditMode

  const [storyType, setStoryType] = useState(requestedType)
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeCover, setEpisodeCover] = useState('')
  const [originalCover, setOriginalCover] = useState('')
  const [coverChanged, setCoverChanged] = useState(false)
  const [tempCover, setTempCover] = useState('')
  const [cropOpen, setCropOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [content, setContent] = useState('')
  const [mangaPages, setMangaPages] = useState([])
  const [mangaUploadBatchIds, setMangaUploadBatchIds] = useState([])
  const mangaUploadAbortRef = useRef(null)
  const editorRef = useRef(null)
  const imageInputRef = useRef(null)
  const savedSelectionRef = useRef(null)
  const undoHistoryRef = useRef([])
  const redoHistoryRef = useRef([])
  const lastHistoryInputRef = useRef({ type: '', at: 0 })
  const applyingHistoryRef = useRef(false)
  const [findReplaceOpen, setFindReplaceOpen] = useState(false)
  const [smartFindReplaceOpen, setSmartFindReplaceOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [localSaveSeconds, setLocalSaveSeconds] = useState(
    LOCAL_AUTOSAVE_INTERVAL_SECONDS
  )
  const localDraftKeyRef = useRef(
    getEpisodeLocalDraftKey(storyId, editEpisodeId || '')
  )

  const localDraftRevisionRef = useRef(0)
  const localSavedRevisionRef = useRef(0)
  const localSaveInFlightRef = useRef(false)
  const localSavePromiseRef = useRef(null)
  const localDraftSnapshotRef = useRef(null)
  const [serverCheckpointMinutes, setServerCheckpointMinutes] = useState(
    SERVER_CHECKPOINT_MINUTES
  )
  const [serverCheckpointSaving, setServerCheckpointSaving] = useState(false)
  const localRecoveryCheckedRef = useRef('')
  const [localRecoveryDraft, setLocalRecoveryDraft] = useState(null)
  const [localRecoveryOpen, setLocalRecoveryOpen] = useState(false)
  const [localRecoveryBusy, setLocalRecoveryBusy] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [cleanModalOpen, setCleanModalOpen] = useState(false)
  const [youtubeSheetOpen, setYoutubeSheetOpen] = useState(false)
  const [youtubeVideo, setYoutubeVideo] = useState({ title: '', url: '' })
  const [youtubeDraft, setYoutubeDraft] = useState({ title: '', url: '' })
  const [editorFocused, setEditorFocused] = useState(false)
  const [alignmentMode, setAlignmentMode] = useState('left')
  const [boldActive, setBoldActive] = useState(false)
  const [italicActive, setItalicActive] = useState(false)
  const [inlineImageUploading, setInlineImageUploading] = useState(false)
  const [toast, setToast] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [oldEpisodeStatus, setOldEpisodeStatus] = useState('draft')
  const [currentEpisodeId, setCurrentEpisodeId] = useState(editEpisodeId || '')
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState(isFirstEpisode ? 1 : null)
  const [storyRecord, setStoryRecord] = useState(null)
  const [genreOptions, setGenreOptions] = useState(FALLBACK_GENRES)
  const [publishSettingsOpen, setPublishSettingsOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [storyLanguage, setStoryLanguage] = useState('Khmer')
  const [mainGenre, setMainGenre] = useState('Romance')
  const [storyTags, setStoryTags] = useState([])
  const [tagDraft, setTagDraft] = useState('')
  const [storyUpdateDays, setStoryUpdateDays] = useState([])
  const [storyStatus, setStoryStatus] = useState('New')
  const [storyAdult, setStoryAdult] = useState(false)
  const [episodeAdult, setEpisodeAdult] = useState(false)
  const [episodeFree, setEpisodeFree] = useState(false)
  const [releaseOption, setReleaseOption] = useState('publish')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [episodeDetailsOpen, setEpisodeDetailsOpen] = useState(false)
  const [draftEpisodeTitle, setDraftEpisodeTitle] = useState('')
  const [draftEpisodeCover, setDraftEpisodeCover] = useState('')
  const [draftCoverChanged, setDraftCoverChanged] = useState(false)
  const displayLanguageId = getDisplayLanguageId()

  const isManga = storyType === 'manga'
  const hasServerEpisode = Boolean(currentEpisodeId || editEpisodeId)
  const plainContent = useMemo(() => episodeHtmlToPlainText(content), [content])
  const characterCount = plainContent.length
  const completedMangaPages = mangaPages.filter((page) => page.status === 'done')
  const mangaErrorCount = mangaPages.filter((page) => page.status === 'error').length
  const mangaUploadPending = mangaPages.some((page) => ['queued', 'processing', 'uploading'].includes(page.status))
  const pageTitle = isEditMode
    ? getDisplayText('episodeEditor.editEpisode')
    : isFirstEpisode
      ? getDisplayText('episodeEditor.firstEpisode')
      : getDisplayText('episodeEditor.episode')
  const stepTitle = isFirstEpisode
    ? getDisplayText('episodeEditor.firstEpisode')
    : getDisplayText('episodeEditor.episode')

  localDraftSnapshotRef.current = {
    storyId,
    episodeId: currentEpisodeId || editEpisodeId || '',
    storyType,
    title: episodeTitle,
    episodeCover,
    content,
    youtubeVideo,
    episodeAdult,
    episodeFree,
    mangaPages,
  }

  const warningText = useMemo(() => {
    if (isManga) {
      if (mangaErrorCount) {
        return getDisplayText('episodeEditor.pageUploadsFailed', {
          count: mangaErrorCount,
        })
      }
      if (mangaUploadPending) return getDisplayText('episodeEditor.pagesStillUploading')
      if (completedMangaPages.length < MANGA_MIN_PUBLISH_PAGES) {
        return getDisplayText('episodeEditor.pagesRequired', {
          current: completedMangaPages.length.toLocaleString(getDisplayLanguageId()),
          required: MANGA_MIN_PUBLISH_PAGES.toLocaleString(getDisplayLanguageId()),
        })
      }
      return ''
    }

    if (characterCount === 0) return ''
    if (characterCount < MIN_CHARACTERS) {
      return getDisplayText('episodeEditor.charactersRequired', {
        current: characterCount.toLocaleString(getDisplayLanguageId()),
        required: MIN_CHARACTERS.toLocaleString(getDisplayLanguageId()),
      })
    }
    if (characterCount > MAX_CHARACTERS) {
      return getDisplayText('episodeEditor.charactersTooLong', {
        current: characterCount.toLocaleString(getDisplayLanguageId()),
        maximum: MAX_CHARACTERS.toLocaleString(getDisplayLanguageId()),
      })
    }
    return ''
  }, [characterCount, completedMangaPages.length, isManga, mangaErrorCount, mangaUploadPending, displayLanguageId])

  const isValidForNext =
    Boolean(episodeTitle.trim()) &&
    !loading &&
    !pageLoading &&
    (isManga
      ? completedMangaPages.length >= MANGA_MIN_PUBLISH_PAGES &&
        completedMangaPages.length <= MANGA_MAX_PAGES &&
        !mangaUploadPending &&
        mangaErrorCount === 0
      : characterCount >= MIN_CHARACTERS && characterCount <= MAX_CHARACTERS)

  const showToast = (text, duration = 2800) => {
    setToast(text)
    window.setTimeout(() => setToast(''), duration)
  }

  const markUnsaved = () => {
  const wasLocallySaved =
    localDraftRevisionRef.current === localSavedRevisionRef.current

  localDraftRevisionRef.current += 1

  if (wasLocallySaved) {
    setLocalSaveSeconds(LOCAL_AUTOSAVE_INTERVAL_SECONDS)
  }

  setSaveStatus('Unsaved')
  setHasUnsavedChanges((current) => {
    if (!current) {
      setServerCheckpointMinutes(SERVER_CHECKPOINT_MINUTES)
    }
    return true
  })
}

  useEffect(() => {
    localDraftKeyRef.current = getEpisodeLocalDraftKey(
      storyId,
      editEpisodeId || ''
    )
    localDraftRevisionRef.current = 0
    localSavedRevisionRef.current = 0
  }, [storyId, editEpisodeId])

  const saveCurrentLocalDraft = useCallback(async () => {
    if (
      localSaveInFlightRef.current ||
      localDraftRevisionRef.current === localSavedRevisionRef.current
    ) {
      return false
    }

    const draft = localDraftSnapshotRef.current
    if (!draft) return false

    const revision = localDraftRevisionRef.current
    const localMangaPages =
      draft.storyType === 'manga'
        ? draft.mangaPages
            .filter((page) => page.status === 'done' && page.imageUrl)
            .map((page) => ({
              id: page.id,
              imageUrl: page.imageUrl,
              storagePath: page.storagePath || null,
              width: page.width || null,
              height: page.height || null,
              fileSize: page.fileSize || null,
              mimeType: page.mimeType || 'image/webp',
              ...mangaPartsPatch(page),
            }))
        : []

    localSaveInFlightRef.current = true
    setSaveStatus('Saving locally...')

    const savePromise = saveEpisodeLocalDraft(localDraftKeyRef.current, {
      storyId: draft.storyId,
      episodeId: draft.episodeId,
      storyType: draft.storyType,
      title: draft.title,
      episodeCover: draft.episodeCover,
      content:
        draft.storyType === 'manga'
          ? ''
          : sanitizeEpisodeHtml(editorRef.current?.innerHTML || draft.content),
      youtubeVideo:
        draft.storyType === 'manga'
          ? { title: '', url: '' }
          : {
              title: String(draft.youtubeVideo?.title || ''),
              url: String(draft.youtubeVideo?.url || ''),
            },
      episodeAdult: draft.episodeAdult,
      episodeFree: draft.episodeFree,
      mangaPages: localMangaPages,
    })

    localSavePromiseRef.current = savePromise

    try {
      await savePromise
      localSavedRevisionRef.current = Math.max(
  localSavedRevisionRef.current,
  revision
)

setSaveStatus(
  localDraftRevisionRef.current === localSavedRevisionRef.current
    ? 'Saved locally'
    : 'Unsaved'
)

return true
    } catch {
      setSaveStatus('Local save failed')
      return false
    } finally {
      localSaveInFlightRef.current = false
      if (localSavePromiseRef.current === savePromise) {
        localSavePromiseRef.current = null
      }
    }
  }, [])

  const updateMangaPage = (pageId, patch) => {
    setMangaPages((current) =>
      current.map((page) => (page.id === pageId ? { ...page, ...patch } : page))
    )
  }

  const processMangaPages = async (entries) => {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  mangaUploadAbortRef.current?.abort()
  const controller = new AbortController()
  mangaUploadAbortRef.current = controller
  setMangaUploadBatchIds(entries.map((entry) => entry.id))

  await runWithConcurrency(entries, 1, async (entry) => {
    try {
      if (controller.signal.aborted) throw new Error(getDisplayText('episodeEditor.uploadCanceled'))

      updateMangaPage(entry.id, {
        status: 'processing',
        progress: 15,
        uploadedBytes: 0,
        uploadSpeed: 0,
        error: '',
      })

      const optimized = await optimizeMangaImage(entry.sourceFile)

      if (controller.signal.aborted) throw new Error(getDisplayText('episodeEditor.uploadCanceled'))

      updateMangaPage(entry.id, {
        status: 'uploading',
        progress: 0,
        width: optimized.width,
        height: optimized.height,
        fileSize: optimized.fileSize,
        mimeType: optimized.mimeType,
        uploadedBytes: 0,
        uploadTotalBytes: optimized.fileSize,
        uploadSpeed: 0,
      })

      const uploaded = await uploadMangaPageFile({
  token,
  file: optimized.file,
  storyId,
  pageId: entry.id,
  signal: controller.signal,
  useV2: true,
        onProgress: ({
  loaded,
  total,
  percent,
  speedBytesPerSecond,
  processing = false,
}) => {
  updateMangaPage(entry.id, {
    status: processing ? 'processing' : 'uploading',
    serverProcessing: Boolean(processing),
    progress: processing ? 100 : percent,
    uploadedBytes: processing ? total : loaded,
    uploadTotalBytes: total,
    uploadSpeed: processing ? 0 : speedBytesPerSecond,
  })
},
      })

      updateMangaPage(entry.id, {
  status: 'done',
  progress: 100,
  imageUrl: uploaded.imageUrl,
  storagePath: uploaded.storagePath,
  width: uploaded.width || optimized.width,
  height: uploaded.height || optimized.height,
  fileSize: uploaded.fileSize || optimized.fileSize,
  mimeType: uploaded.mimeType || optimized.mimeType,
  parts: Array.isArray(uploaded.parts) ? uploaded.parts : [],
  uploadedBytes: optimized.fileSize,
  uploadTotalBytes: optimized.fileSize,
  uploadSpeed: 0,
  error: '',
})
    } catch (error) {
      updateMangaPage(entry.id, {
        status: 'error',
        progress: 0,
        uploadedBytes: 0,
        uploadSpeed: 0,
        error: error.message || 'Upload failed',
      })
    }
  })

  if (mangaUploadAbortRef.current === controller) {
    mangaUploadAbortRef.current = null
  }
}

    useEffect(() => {
    let cancelled = false

    async function loadPageData() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setPageLoading(true)
        setMessage('')

        const storyResponse = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const storyData = await storyResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || getDisplayText('episodeEditor.failedLoadStory'))
        }

        const loadedStory = storyData.story || {}
        const resolvedType = loadedStory.story_type || 'novel'

        if (!cancelled) {
          setStoryRecord(loadedStory)
          setStoryType(resolvedType)
          setStoryLanguage(loadedStory.story_language || 'Khmer')
          setMainGenre(loadedStory.main_genre || 'Romance')
          setStoryTags(Array.isArray(loadedStory.tags) ? loadedStory.tags.slice(0, 6) : [])
          setStoryUpdateDays(Array.isArray(loadedStory.update_days) ? loadedStory.update_days : [])
          setStoryStatus(loadedStory.story_status || 'New')
          setStoryAdult(Boolean(loadedStory.is_adult))
        }

        if (!isEditMode) return

        const episodeResponse = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/episodes/${editEpisodeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const episodeData = await episodeResponse.json().catch(() => ({}))

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw new Error(episodeData.message || getDisplayText('episodeEditor.failedLoadEpisode'))
        }

        if (cancelled) return

        const episode = episodeData.episode || {}

        setEpisodeTitle(episode.title || '')
        setEpisodeCover(episode.cover_url || '')
        setOriginalCover(episode.cover_url || '')
        setContent(normalizeEpisodeHtml(episode.content || ''))
        setOldEpisodeStatus(episode.status || 'draft')
        setEpisodeAdult(Boolean(episode.is_adult))
        setEpisodeFree(Boolean(episode.is_author_free ?? episode.is_free_published))
        setCurrentEpisodeNumber(Number(episode.episode_number || 1))
        setCoverChanged(false)

        setMangaPages(
          (episode.pages || []).map((page, index) => ({
            id: page.id || `existing-${index}`,
            previewUrl: page.image_url,
            imageUrl: page.image_url,
            storagePath: page.storage_path || null,
            width: page.width || null,
            height: page.height || null,
            fileSize: page.file_size || null,
            mimeType: page.mime_type || 'image/webp',
            ...mangaPartsPatch(page),
            sourceFile: null,
            status: 'done',
            progress: 100,
            error: '',
          }))
        )

        setSaveStatus('Saved')
        setHasUnsavedChanges(false)
      } catch (error) {
        if (!cancelled) setMessage(error.message || getDisplayText('episodeEditor.failedLoadEpisode'))
      } finally {
        if (!cancelled) setPageLoading(false)
      }
    }

    loadPageData()

    return () => {
      cancelled = true
    }
  }, [editEpisodeId, isEditMode, navigate, storyId])

    useEffect(() => {
    if (pageLoading) return undefined

    const key = getEpisodeLocalDraftKey(storyId, editEpisodeId || '')

    if (localRecoveryCheckedRef.current === key) return undefined

    localRecoveryCheckedRef.current = key
    let cancelled = false

    const checkLocalDraft = async () => {
      try {
        const draft = await loadEpisodeLocalDraft(key)
        if (cancelled || !draft) return

        const draftType = draft.storyType === 'manga' ? 'manga' : 'novel'
        const currentType = storyType === 'manga' ? 'manga' : 'novel'
        const draftYoutube = draft.youtubeVideo || {}

        const currentPageData =
          currentType === 'manga'
            ? mangaPages
                .filter((page) => page.status === 'done' && page.imageUrl)
                .map((page) => ({
                  imageUrl: page.imageUrl,
                  storagePath: page.storagePath || null,
                  width: page.width || null,
                  height: page.height || null,
                  fileSize: page.fileSize || null,
                  mimeType: page.mimeType || 'image/webp',
                  ...mangaPartsPatch(page),
                }))
            : []

        const draftPageData =
          draftType === 'manga'
            ? (draft.mangaPages || []).map((page) => ({
                imageUrl: page.imageUrl,
                storagePath: page.storagePath || null,
                width: page.width || null,
                height: page.height || null,
                fileSize: page.fileSize || null,
                mimeType: page.mimeType || 'image/webp',
              ...mangaPartsPatch(page),
              }))
            : []

        const hasDifference =
          draftType !== currentType ||
          String(draft.title || '') !== String(episodeTitle || '') ||
          String(draft.episodeCover || '') !== String(episodeCover || '') ||
          (draftType === 'novel' &&
            sanitizeEpisodeHtml(draft.content || '') !== sanitizeEpisodeHtml(content || '')) ||
          String(draftYoutube.title || '') !== String(youtubeVideo.title || '') ||
          String(draftYoutube.url || '') !== String(youtubeVideo.url || '') ||
          Boolean(draft.episodeAdult) !== Boolean(episodeAdult) ||
          Boolean(draft.episodeFree) !== Boolean(episodeFree) ||
          JSON.stringify(draftPageData) !== JSON.stringify(currentPageData)

        if (!hasDifference) {
          await deleteEpisodeLocalDraft(key)
          return
        }

        if (cancelled) return
        setLocalRecoveryDraft(draft)
        setLocalRecoveryOpen(true)
      } catch {
      }
    }

    checkLocalDraft()

    return () => {
      cancelled = true
    }
  }, [pageLoading, storyId, editEpisodeId])

  const handleRestoreLocalDraft = () => {
    const draft = localRecoveryDraft
    if (!draft || localRecoveryBusy) return

    setLocalRecoveryBusy(true)

    const restoredType = draft.storyType === 'manga' ? 'manga' : 'novel'
    const restoredYoutube = draft.youtubeVideo || {}

    setStoryType(restoredType)
    setEpisodeTitle(String(draft.title || ''))
    setEpisodeCover(String(draft.episodeCover || ''))
    setContent(restoredType === 'manga' ? '' : normalizeEpisodeHtml(draft.content || ''))
    setYoutubeVideo(
      restoredType === 'manga'
        ? { title: '', url: '' }
        : {
            title: String(restoredYoutube.title || ''),
            url: String(restoredYoutube.url || ''),
          }
    )
    setEpisodeAdult(Boolean(draft.episodeAdult))
    setEpisodeFree(Boolean(draft.episodeFree))

    if (draft.episodeId) setCurrentEpisodeId(String(draft.episodeId))

    if (restoredType === 'manga') {
      setMangaPages(
        (draft.mangaPages || [])
          .filter((page) => page.imageUrl)
          .map((page, index) => ({
            id: page.id || `local-${index}`,
            previewUrl: page.imageUrl,
            imageUrl: page.imageUrl,
            storagePath: page.storagePath || null,
            width: page.width || null,
            height: page.height || null,
            fileSize: page.fileSize || null,
            mimeType: page.mimeType || 'image/webp',
            ...mangaPartsPatch(page),
            sourceFile: null,
            status: 'done',
            progress: 100,
            error: '',
          }))
      )
    } else {
      setMangaPages([])
    }

    undoHistoryRef.current = []
    redoHistoryRef.current = []
    lastHistoryInputRef.current = { type: '', at: 0 }
    setServerCheckpointMinutes(SERVER_CHECKPOINT_MINUTES)
    setHasUnsavedChanges(true)
    setSaveStatus('Saved locally')
    setLocalRecoveryOpen(false)
    setLocalRecoveryDraft(null)
    setLocalRecoveryBusy(false)
    showToast(getDisplayText('episodeEditor.localDraftRestored'))
  }

  const handleDiscardLocalDraft = async () => {
    const draft = localRecoveryDraft
    if (!draft || localRecoveryBusy) return

    try {
      setLocalRecoveryBusy(true)
      if (localSavePromiseRef.current) {
        await localSavePromiseRef.current.catch(() => {})
      }
      localSavedRevisionRef.current = localDraftRevisionRef.current
      await cleanupTemporaryMangaPages(
        draft.storyType === 'manga'
          ? draft.mangaPages || []
          : []
      )
      await deleteEpisodeLocalDraft(localDraftKeyRef.current)
      setLocalRecoveryOpen(false)
      setLocalRecoveryDraft(null)

      if (!editEpisodeId && draft.episodeId) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('editEpisodeId', String(draft.episodeId))
        nextParams.set('first', '0')
        nextParams.set('type', draft.storyType === 'manga' ? 'manga' : 'novel')
        navigate(`${window.location.pathname}?${nextParams.toString()}`, { replace: true })
      }
    } finally {
      setLocalRecoveryBusy(false)
    }
  }

  const trimEditorHistory = (stack) => {
    if (stack.length > MAX_EDITOR_HISTORY) {
      stack.splice(0, stack.length - MAX_EDITOR_HISTORY)
    }
  }

  const resetEditorHistoryGrouping = () => {
    lastHistoryInputRef.current = { type: '', at: 0 }
  }

  const recordEditorSnapshot = (html = editorRef.current?.innerHTML || content) => {
    if (applyingHistoryRef.current) return

    const safeHtml = sanitizeEpisodeHtml(html)
    const stack = undoHistoryRef.current

    if (stack[stack.length - 1] !== safeHtml) {
      stack.push(safeHtml)
      trimEditorHistory(stack)
    }

    redoHistoryRef.current = []
  }

  const applyEditorHistory = (html) => {
    const safeHtml = sanitizeEpisodeHtml(html)
    applyingHistoryRef.current = true

    if (editorRef.current) {
      editorRef.current.innerHTML = safeHtml
      editorRef.current.focus()

      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)

      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      savedSelectionRef.current = range.cloneRange()
    }

    setContent(safeHtml)
    markUnsaved()
    applyingHistoryRef.current = false
  }

  useEffect(() => {
    undoHistoryRef.current = []
    redoHistoryRef.current = []
    resetEditorHistoryGrouping()
  }, [storyId, editEpisodeId])

  const syncEditorContent = (nextHtml, markChanged = true) => {
    const safeHtml = sanitizeEpisodeHtml(nextHtml)

    if (markChanged) {
      recordEditorSnapshot(editorRef.current?.innerHTML || content)
      resetEditorHistoryGrouping()
    }

    setContent(safeHtml)

    if (editorRef.current && editorRef.current.innerHTML !== safeHtml) {
      editorRef.current.innerHTML = safeHtml
    }

    if (markChanged) markUnsaved()
  }

  useEffect(() => {
    if (!editorRef.current) return
    const safeHtml = normalizeEpisodeHtml(content)
    if (editorRef.current.innerHTML !== safeHtml) {
      editorRef.current.innerHTML = safeHtml
    }
  }, [content, pageLoading])

  const updateFormattingState = useCallback(() => {
    if (!editorRef.current || !editorRef.current.contains(document.activeElement)) return

    setBoldActive(Boolean(document.queryCommandState('bold')))
    setItalicActive(Boolean(document.queryCommandState('italic')))

    if (document.queryCommandState('justifyCenter')) {
      setAlignmentMode('center')
    } else if (document.queryCommandState('justifyRight')) {
      setAlignmentMode('right')
    } else {
      setAlignmentMode('left')
    }
  }, [])

  const saveEditorSelection = useCallback(() => {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection?.rangeCount) return

    const range = selection.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) return
    savedSelectionRef.current = range.cloneRange()
    updateFormattingState()
  }, [updateFormattingState])

  const restoreEditorSelection = useCallback(() => {
    const editor = editorRef.current
    const range = savedSelectionRef.current
    if (!editor) return

    editor.focus()
    if (!range) return

    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }, [])

  const handleEditorBeforeInput = (event) => {
    if (applyingHistoryRef.current) return

    const inputType = event.nativeEvent?.inputType || ''
    const now = Date.now()
    const groupable = [
      'insertText',
      'insertCompositionText',
      'deleteContentBackward',
      'deleteContentForward',
    ].includes(inputType)

    const last = lastHistoryInputRef.current
    const sameGroup = groupable && last.type === inputType && now - last.at <= EDITOR_HISTORY_GROUP_MS

    if (!sameGroup) recordEditorSnapshot(event.currentTarget.innerHTML)
    lastHistoryInputRef.current = { type: inputType, at: now }
  }

  const handleEditorPaste = (event) => {
    recordEditorSnapshot(event.currentTarget.innerHTML)
    lastHistoryInputRef.current = { type: 'insertFromPaste', at: Date.now() }
  }

  const handleEditorInput = (event) => {
    setContent(event.currentTarget.innerHTML)
    markUnsaved()
    saveEditorSelection()
  }

  const runEditorCommand = (command, value = null) => {
    recordEditorSnapshot()
    resetEditorHistoryGrouping()
    restoreEditorSelection()
    document.execCommand(command, false, value)
    setContent(editorRef.current?.innerHTML || '')
    markUnsaved()
    saveEditorSelection()
  }

  const handleAlignmentChange = () => {
    const nextAlignment = alignmentMode === 'left' ? 'center' : alignmentMode === 'center' ? 'right' : 'left'
    const command = nextAlignment === 'center' ? 'justifyCenter' : nextAlignment === 'right' ? 'justifyRight' : 'justifyLeft'

    runEditorCommand(command)
    setAlignmentMode(nextAlignment)
  }

  const insertHtmlAtSelection = (html) => {
    recordEditorSnapshot()
    resetEditorHistoryGrouping()
    restoreEditorSelection()

    if (document.queryCommandSupported?.('insertHTML')) {
      document.execCommand('insertHTML', false, html)
    } else {
      const selection = window.getSelection()
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null
      if (!range) return
      const fragment = range.createContextualFragment(html)
      range.deleteContents()
      range.insertNode(fragment)
    }

    setContent(editorRef.current?.innerHTML || '')
    markUnsaved()
    saveEditorSelection()
  }

  const handleInlineImagePick = async (file) => {
    if (!file) return

    try {
      const currentHtml = editorRef.current?.innerHTML || content

      if (countEpisodeImages(currentHtml) >= NOVEL_IMAGE_MAX_COUNT) {
        throw new Error(getDisplayText('episodeEditor.onlyTwoImages'))
      }

      const token = getAuthToken()
      if (!token) {
        navigate('/login')
        return
      }

      setInlineImageUploading(true)
      const uploadFile = isNovelHeicFile(file)
        ? await convertNovelHeicForUpload(file)
        : file

      const imageUrl = await uploadEpisodeInlineImage({ token, file: uploadFile })
      if (!imageUrl) throw new Error(getDisplayText('episodeEditor.imageUrlMissing'))

      insertHtmlAtSelection(
        `<p><img src="${escapeEpisodeHtml(imageUrl)}" alt="Episode image"></p><p><br></p>`
      )
      showToast(getDisplayText('episodeEditor.imageAdded'))
    } catch (error) {
      showToast(error.message || getDisplayText('episodeEditor.couldNotAddImage'))
    } finally {
      setInlineImageUploading(false)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  const handleConfirmCleanParagraphs = () => {
    const cleanedContent = cleanEpisodeHtmlSpacing(content)
    setCleanModalOpen(false)

    if (cleanedContent === sanitizeEpisodeHtml(content)) {
      showToast(getDisplayText('episodeEditor.noBrokenSpacing'))
      return
    }

    syncEditorContent(cleanedContent)
    showToast(getDisplayText('episodeEditor.paragraphsCleaned'))
  }

  const openYouTubeSheet = () => {
    setYoutubeDraft(youtubeVideo)
    setYoutubeSheetOpen(true)
  }

  const saveYouTubeVideo = () => {
    const nextVideo = {
      title: String(youtubeDraft.title || '').trim(),
      url: String(youtubeDraft.url || '').trim(),
    }

    if (nextVideo.title !== youtubeVideo.title || nextVideo.url !== youtubeVideo.url) {
      setYoutubeVideo(nextVideo)
      markUnsaved()
    }

    setYoutubeSheetOpen(false)
  }

  const removeYouTubeVideo = () => {
    if (youtubeVideo.title || youtubeVideo.url) markUnsaved()

    setYoutubeVideo({ title: '', url: '' })
    setYoutubeDraft({ title: '', url: '' })
    setYoutubeSheetOpen(false)
  }

  const openEpisodeDetails = () => {
    setDraftEpisodeTitle(episodeTitle)
    setDraftEpisodeCover(episodeCover)
    setDraftCoverChanged(coverChanged)
    setEpisodeDetailsOpen(true)
  }

  const closeEpisodeDetails = () => {
    setDraftEpisodeTitle(episodeTitle)
    setDraftEpisodeCover(episodeCover)
    setDraftCoverChanged(coverChanged)
    setEpisodeDetailsOpen(false)
  }

  const saveEpisodeDetails = () => {
    const nextTitle = draftEpisodeTitle.trim()
    if (!nextTitle) return

    const detailsChanged =
      nextTitle !== episodeTitle ||
      draftEpisodeCover !== episodeCover ||
      draftCoverChanged !== coverChanged

    setEpisodeTitle(nextTitle)
    setEpisodeCover(draftEpisodeCover)
    setCoverChanged(draftCoverChanged)
    setEpisodeDetailsOpen(false)

    if (detailsChanged) markUnsaved()
  }

  const handleUndo = () => {
    resetEditorHistoryGrouping()

    const previousHtml = undoHistoryRef.current.pop()
    if (previousHtml === undefined) return

    const currentHtml = sanitizeEpisodeHtml(editorRef.current?.innerHTML || content)

    if (redoHistoryRef.current[redoHistoryRef.current.length - 1] !== currentHtml) {
      redoHistoryRef.current.push(currentHtml)
      trimEditorHistory(redoHistoryRef.current)
    }

    applyEditorHistory(previousHtml)
  }

  const handleRedo = () => {
    resetEditorHistoryGrouping()

    const nextHtml = redoHistoryRef.current.pop()
    if (nextHtml === undefined) return

    const currentHtml = sanitizeEpisodeHtml(editorRef.current?.innerHTML || content)

    if (undoHistoryRef.current[undoHistoryRef.current.length - 1] !== currentHtml) {
      undoHistoryRef.current.push(currentHtml)
      trimEditorHistory(undoHistoryRef.current)
    }

    applyEditorHistory(nextHtml)
  }

  const handleEditorKeyDown = (event) => {
    if (event.isComposing) return

    const key = event.key.toLowerCase()
    const isDesktopKeyboard = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

    if (key === 'enter' && isDesktopKeyboard && !event.altKey) {
      event.preventDefault()

      if (event.ctrlKey || event.metaKey) {
        if (isValidForNext) handleNext()
        return
      }

      const selection = window.getSelection()
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null
      if (!range || !event.currentTarget.contains(range.commonAncestorContainer)) return

      recordEditorSnapshot(event.currentTarget.innerHTML)
      resetEditorHistoryGrouping()

      const breakNode = document.createElement('br')
      range.deleteContents()
      range.insertNode(breakNode)
      range.setStartAfter(breakNode)
      range.collapse(true)

      selection.removeAllRanges()
      selection.addRange(range)
      savedSelectionRef.current = range.cloneRange()

      setContent(event.currentTarget.innerHTML)
      markUnsaved()
      return
    }

    if (!(event.ctrlKey || event.metaKey) || event.altKey) return

    if (key === 'z') {
      event.preventDefault()
      if (event.shiftKey) handleRedo()
      else handleUndo()
      return
    }

    if (key === 'y') {
      event.preventDefault()
      handleRedo()
    }
  }

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCoverChange = (file) => {
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setOriginalCover(imageUrl)
    setTempCover(imageUrl)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setDraftCoverChanged(true)
    setCropOpen(true)
  }

  const handleSaveCoverCrop = async () => {
    if (!tempCover || !croppedAreaPixels) {
      showToast(getDisplayText('episodeEditor.adjustCover'))
      return
    }

    try {
      const croppedImage = await getCroppedImage(tempCover, croppedAreaPixels)
      setDraftEpisodeCover(croppedImage)
      setDraftCoverChanged(true)
      setCropOpen(false)
    } catch {
      showToast(getDisplayText('episodeEditor.saveCropFailed'))
    }
  }


  const handlePickMangaPages = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return

    if (files.length > MANGA_MAX_FILES_PER_PICK) {
      showToast(`Choose no more than ${MANGA_MAX_FILES_PER_PICK} images each time.`)
      return
    }

    if (mangaPages.length + files.length > MANGA_MAX_PAGES) {
      showToast(`Manga episode can contain no more than ${MANGA_MAX_PAGES} pages.`)
      return
    }

    const errors = files.map(validateMangaFile).filter(Boolean)
    if (errors.length) {
      showToast(errors[0])
      return
    }

    const entries = files.map((file) => ({
      id: makeLocalId(),
      previewUrl: URL.createObjectURL(file),
      imageUrl: '',
      storagePath: null,
      width: null,
      height: null,
      fileSize: file.size,
      mimeType: file.type,
      sourceFile: file,
      status: 'queued',
      progress: 5,
      error: '',
    }))

    setMangaPages((current) => [...current, ...entries])
    markUnsaved()
    await processMangaPages(entries)
  }

  const handleReplaceMangaPage = async (pageId, file) => {
    if (!file) return
    const validationError = validateMangaFile(file)

    if (validationError) {
      showToast(validationError)
      return
    }

    const previousPage = mangaPages.find(
  (page) => page.id === pageId
)

await cleanupTemporaryMangaPages(
  previousPage ? [previousPage] : []
)

    const entry = {
      id: pageId,
      previewUrl: URL.createObjectURL(file),
      sourceFile: file,
    }

    setMangaPages((current) =>
      current.map((page) => {
        if (page.id !== pageId) return page
        if (String(page.previewUrl || '').startsWith('blob:')) URL.revokeObjectURL(page.previewUrl)
        return {
          ...page,
          ...entry,
          imageUrl: '',
          storagePath: null,
          parts: [],
          fileSize: file.size,
          mimeType: file.type,
          status: 'queued',
          progress: 5,
          error: '',
        }
      })
    )

    markUnsaved()
    await processMangaPages([{ ...entry, status: 'queued' }])
  }

  const handleRetryMangaPage = async (pageId) => {
    const page = mangaPages.find((item) => item.id === pageId)
    if (!page?.sourceFile) {
      showToast(getDisplayText('episodeEditor.chooseReplacementImage'))
      return
    }

    updateMangaPage(pageId, { status: 'queued', progress: 5, error: '' })
    await processMangaPages([page])
  }

  const handleDeleteMangaPage = async (pageId) => {
  const page = mangaPages.find((item) => item.id === pageId)

  setMangaPages((current) => {
    if (String(page?.previewUrl || '').startsWith('blob:')) {
      URL.revokeObjectURL(page.previewUrl)
    }

    return current.filter((item) => item.id !== pageId)
  })

  markUnsaved()
  await cleanupTemporaryMangaPages(page ? [page] : [])
}

  const handleMoveMangaPage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= mangaPages.length || fromIndex === toIndex) return

    setMangaPages((current) => {
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
    markUnsaved()
  }

  const handleSaveEpisode = async ({
  goToPublish = false,
  forceDraft = false,
  stayOnPage = false,
} = {}) => {
    setMessage('')

    if (localSavePromiseRef.current) {
      await localSavePromiseRef.current.catch(() => {})
    }

    if (!episodeTitle.trim()) {
      setMessage(getDisplayText('episodeEditor.enterEpisodeTitle'))
      return null
    }

    if (isManga) {
      if (mangaUploadPending) {
        setMessage(getDisplayText('episodeEditor.waitMangaUploads'))
        return null
      }

      if (mangaErrorCount) {
        setMessage(getDisplayText('episodeEditor.retryFailedPages'))
        return null
      }

      if (goToPublish && completedMangaPages.length < MANGA_MIN_PUBLISH_PAGES) {
        setMessage(`Manga episodes need at least ${MANGA_MIN_PUBLISH_PAGES} pages.`)
        return null
      }
    } else {
      if (goToPublish && !hasEpisodeContent(content)) {
        setMessage(getDisplayText('episodeEditor.writeContent'))
        return null
      }

      if (goToPublish && characterCount < MIN_CHARACTERS) {
        setMessage(getDisplayText('episodeEditor.minimumCharacters'))
        return null
      }

      if (characterCount > MAX_CHARACTERS) {
        setMessage(getDisplayText('episodeEditor.maximumCharacters'))
        return null
      }
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      throw new Error(getDisplayText('episodeEditor.pleaseLogin'))
    }

    const episodeCoverUrl = episodeCover
      ? await uploadImageToStorage({
          token,
          imageDataUrl: episodeCover,
          folder: 'episode_cover',
          fileName: `episode-cover-${storyId}-${Date.now()}.jpg`,
        })
      : null

    if (episodeCoverUrl && episodeCoverUrl !== episodeCover) {
      setEpisodeCover(episodeCoverUrl)
      setOriginalCover(episodeCoverUrl)
      setCoverChanged(false)
    }

    const pagesPayload = completedMangaPages.map((page) => ({
      image_url: page.imageUrl,
      storage_path: page.storagePath,
      width: page.width,
      height: page.height,
      file_size: page.fileSize,
      mime_type: page.mimeType || 'image/webp',
      ...mangaPartsPatch(page),
    }))

    const targetEpisodeId = currentEpisodeId || editEpisodeId || ''

    const response = await fetch(
      targetEpisodeId
        ? `${API_BASE_URL}/api/stories/${storyId}/episodes/${targetEpisodeId}`
        : `${API_BASE_URL}/api/stories/${storyId}/episodes/create`,
      {
        method: targetEpisodeId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: episodeTitle.trim(),
          cover_url: episodeCoverUrl,
          content: isManga ? '' : sanitizeEpisodeHtml(content),
          youtube_url: isManga ? '' : youtubeVideo.url,
          youtube_title: isManga ? '' : youtubeVideo.title,
          pages: isManga ? pagesPayload : undefined,
          is_adult: episodeAdult,
          is_free_published: episodeFree,
          status: forceDraft ? 'draft' : targetEpisodeId ? oldEpisodeStatus : 'draft',
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.error || data.message || (targetEpisodeId ? getDisplayText('episodeEditor.failedUpdateEpisode') : getDisplayText('episodeEditor.failedCreateEpisode')))
    }

    const episodeId = data.episode?.id || targetEpisodeId

    if (!episodeId) {
      throw new Error(targetEpisodeId ? getDisplayText('episodeEditor.updatedMissingId') : getDisplayText('episodeEditor.createdMissingId'))
    }

    setCurrentEpisodeId(episodeId)
    setCurrentEpisodeNumber(Number(data.episode?.episode_number || currentEpisodeNumber || 1))
    setSaveStatus('Saved')
    setHasUnsavedChanges(false)
    localSavedRevisionRef.current = localDraftRevisionRef.current
    await deleteEpisodeLocalDraft(localDraftKeyRef.current)

    if (!goToPublish && !stayOnPage) {
  navigate(`/author/story/${storyId}/manage`)
}

    return {
      episodeId,
      episodeNumber: data.episode?.episode_number || 1,
    }
  }

  useEffect(() => {
    if (
      !hasUnsavedChanges ||
      pageLoading ||
      localSaveInFlightRef.current ||
      localDraftRevisionRef.current === localSavedRevisionRef.current ||
      localSaveSeconds <= 0
    ) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setLocalSaveSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [hasUnsavedChanges, localSaveSeconds, pageLoading, saveStatus])

  useEffect(() => {
    if (
      !hasUnsavedChanges ||
      pageLoading ||
      localSaveSeconds !== 0 ||
      localSaveInFlightRef.current ||
      localDraftRevisionRef.current === localSavedRevisionRef.current
    ) {
      return
    }

    saveCurrentLocalDraft().finally(() => {
      setLocalSaveSeconds(LOCAL_AUTOSAVE_INTERVAL_SECONDS)
    })
  }, [
    hasUnsavedChanges,
    localSaveSeconds,
    pageLoading,
    saveCurrentLocalDraft,
  ])

  const handleServerCheckpoint = async () => {
    const targetEpisodeId = currentEpisodeId || editEpisodeId

    if (
      !targetEpisodeId ||
      !hasUnsavedChanges ||
      serverCheckpointSaving ||
      loading ||
      pageLoading ||
      !episodeTitle.trim() ||
      mangaUploadPending
    ) {
      setServerCheckpointMinutes(SERVER_CHECKPOINT_MINUTES)
      return
    }

    try {
      setServerCheckpointSaving(true)
      setSaveStatus('Backing up to server...')

      await handleSaveEpisode({
        forceDraft: false,
        stayOnPage: true,
      })

      setSaveStatus('Saved')
    } catch {
      setSaveStatus('Saved locally')
    } finally {
      setServerCheckpointSaving(false)
      setServerCheckpointMinutes(SERVER_CHECKPOINT_MINUTES)
    }
  }

  useEffect(() => {
    if (
      !hasServerEpisode ||
      !hasUnsavedChanges ||
      serverCheckpointSaving ||
      loading ||
      pageLoading
    ) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setServerCheckpointMinutes((current) => Math.max(0, current - 1))
    }, 60 * 1000)

    return () => window.clearInterval(timer)
  }, [
    hasServerEpisode,
    hasUnsavedChanges,
    loading,
    pageLoading,
    serverCheckpointSaving,
  ])

  useEffect(() => {
    if (
      !hasServerEpisode ||
      serverCheckpointMinutes !== 0 ||
      !hasUnsavedChanges ||
      serverCheckpointSaving ||
      loading ||
      pageLoading
    ) {
      return
    }

    handleServerCheckpoint()
  }, [
    hasServerEpisode,
    serverCheckpointMinutes,
    hasUnsavedChanges,
    serverCheckpointSaving,
    loading,
    pageLoading,
  ])
  
  const handleSaveDraft = async () => {
    try {
      setLoading(true)
      await handleSaveEpisode({ forceDraft: true })
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? getDisplayText('episodeEditor.cannotConnect')
          : error.message || (isEditMode ? getDisplayText('episodeEditor.failedUpdateEpisode') : getDisplayText('episodeEditor.failedSaveDraft'))
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitModal(true)
      return
    }

    if (searchParams.get('fromPublishSuccess') === '1' || searchParams.get('fromPublishWarning') === '1') {
      navigate('/author/dashboard', { replace: true })
      return
    }

    navigate(returnTo, { replace: true })
  }

  const handleDiscard = async () => {
    setShowExitModal(false)

    if (localSavePromiseRef.current) {
      await localSavePromiseRef.current.catch(() => {})
    }

    localSavedRevisionRef.current = localDraftRevisionRef.current
    await cleanupTemporaryMangaPages(mangaPages)
    await deleteEpisodeLocalDraft(localDraftKeyRef.current)

    if (searchParams.get('fromPublishSuccess') === '1' || searchParams.get('fromPublishWarning') === '1') {
      navigate('/author/dashboard', { replace: true })
      return
    }

    navigate(returnTo, { replace: true })
  }

  const handleSaveDraftAndLeave = async () => {
    setShowExitModal(false)
    await handleSaveDraft()
  }

  const addStoryTag = (value = tagDraft) => {
    const tag = String(value || '').trim()
    if (!tag || storyTags.length >= 6) return
    if (storyTags.some((item) => item.toLowerCase() === tag.toLowerCase())) return

    setStoryTags((current) => [...current, tag])
    setTagDraft('')
  }

  const removeStoryTag = (tag) => {
    setStoryTags((current) => current.filter((item) => item !== tag))
  }

  const toggleStoryUpdateDay = (day) => {
    setStoryUpdateDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day]
    )
  }

  const saveStorySettings = async (token) => {
    if (!storyRecord) throw new Error(getDisplayText('episodeEditor.storyLoading'))

    const slides = (storyRecord.slides || []).map((slide, index) => ({
      image_url: slide.image_url,
      sort_order: Number(slide.sort_order ?? index),
      is_active: slide.is_active !== false,
    }))

    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: storyRecord.title,
        story_type: storyRecord.story_type || storyType,
        story_language: storyLanguage,
        main_genre: mainGenre,
        story_status: storyStatus,
        tags: storyTags,
        update_days: storyUpdateDays,
        description: storyRecord.description || null,
        is_adult: storyAdult,
        cover_url: storyRecord.cover_url || null,
        landscape_thumbnail_url: storyRecord.landscape_thumbnail_url || null,
        slides,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
  data.error || data.message || getDisplayText('episodeEditor.failedUpdateStoryInfo')
)
    }

    setStoryRecord(data.story || storyRecord)
  }

  const handleSavePublishSettings = async () => {
    if (settingsSaving) return

    if (!currentEpisodeId) {
      setMessage(getDisplayText('episodeEditor.missingEpisodeId'))
      return
    }

    if (releaseOption === 'schedule' && (!scheduleDate || !scheduleTime)) {
      setMessage(getDisplayText('episodeEditor.chooseSchedule'))
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSettingsSaving(true)
      setMessage('')

      if (isFirstEpisode) {
  await saveStorySettings(token)
}

      const status =
        releaseOption === 'schedule'
          ? 'scheduled'
          : releaseOption === 'draft'
            ? 'draft'
            : 'published'

      const scheduledAt =
        releaseOption === 'schedule'
          ? new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()
          : null

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/episodes/${currentEpisodeId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
  status,
  scheduled_at: scheduledAt,
  is_adult: episodeAdult,
  is_free_published: episodeFree,
}),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        const blockedWords =
          data.blocked_words_found || data.blockedWordsFound || []

        if (data.code === 'BLOCKED_WORDS_FOUND' || blockedWords.length) {
          navigate(`/author/story/${storyId}/episode/publish-warning`, {
            replace: true,
            state: {
              episodeId: currentEpisodeId,
              blockedWords,
            },
          })
          return
        }

        throw new Error(data.message || getDisplayText('episodeEditor.failedSavePublish'))
      }

      setPublishSettingsOpen(false)
setOldEpisodeStatus(status)
setHasUnsavedChanges(false)
setSaveStatus('Saved')
setSuccessOpen(true)
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? getDisplayText('episodeEditor.cannotConnect')
          : error.message || getDisplayText('episodeEditor.failedSavePublish')
      )
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleNext = async () => {
    try {
      setLoading(true)
      const saved = await handleSaveEpisode({ goToPublish: true })
      if (!saved) return

      setCurrentEpisodeId(saved.episodeId)
      setCurrentEpisodeNumber(Number(saved.episodeNumber || currentEpisodeNumber || 1))
      setPublishSettingsOpen(true)
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? getDisplayText('episodeEditor.cannotConnect')
          : error.message || (isEditMode ? getDisplayText('episodeEditor.failedUpdateEpisode') : getDisplayText('episodeEditor.failedCreateEpisode'))
      )
    } finally {
      setLoading(false)
    }
  }

  return (
  <div
    className={`min-h-screen bg-[var(--shadow-bg-surface)] pb-0 sm:bg-[var(--shadow-bg-soft)] ${
      isManga ? 'manga-red-theme' : ''
    }`}
  >
    {isManga && mangaUploadPending ? (
  <MangaUploadProgressModal
    pages={mangaPages.filter((page) => mangaUploadBatchIds.includes(page.id))}
    onCancel={() => mangaUploadAbortRef.current?.abort()}
  />
) : null}
    
    <style>{`
  .rich-episode-editor:empty::before {
    content: attr(data-placeholder);
    color: var(--shadow-placeholder);
    pointer-events: none;
  }

  .rich-episode-editor p,
  .rich-episode-editor div {
    min-height: 1.5em;
    margin: 0 0 1em;
  }

  .rich-episode-editor img {
    display: block;
    width: 100%;
    max-height: 70vh;
    margin: 1rem 0;
    border-radius: 12px;
    object-fit: contain;
  }

  .manga-red-theme button:not(:disabled)[class*="bg-[var(--shadow-text-primary)]"],
  .manga-red-theme button:not(:disabled)[class*="bg-[#e5484d]"],
  .manga-red-theme label[class*="bg-[var(--shadow-text-primary)]"] {
    background-color: #FE526E !important;
  }

  .manga-red-theme button[class*="text-[#0b5cff]"] {
    color: #FE526E !important;
  }

  .manga-red-theme input[type="range"] {
    accent-color: #FE526E;
  }

  .manga-red-theme
    button:not(:disabled)[class*="shadow-[0_14px_30px_rgba(17,24,39,0.25)]"] {
    box-shadow: 0 14px 30px rgba(254, 82, 110, 0.28) !important;
  }
`}</style>

    <Toast message={toast} onClose={() => setToast('')} />

    <SuccessModal
  open={successOpen}
  isManga={isManga}
  isFirstEpisode={Number(currentEpisodeNumber || 1) === 1}
  releaseOption={releaseOption}
  episodeNumber={Number(currentEpisodeNumber || 1)}
  episodeTitle={episodeTitle}
  onStoryManager={() => {
    setSuccessOpen(false)
    navigate('/author/dashboard', { replace: true })

    window.setTimeout(() => {
      navigate(`/author/story/${storyId}/manage`)
    }, 0)
  }}
  onAddEpisode={() => {
    const path =
      `/author/story/${storyId}/episode/create` +
      `?first=0&fromPublishSuccess=1&type=${isManga ? 'manga' : 'novel'}`

    setSuccessOpen(false)
    navigate('/author/dashboard', { replace: true })

    window.setTimeout(() => {
      navigate(path)
    }, 0)
  }}
/>

      <PublishSettingsSheet
        open={publishSettingsOpen}
        episodeTitle={episodeTitle}
        showStorySettings={isFirstEpisode}
        genreOptions={genreOptions}
        storyLanguage={storyLanguage}
        onStoryLanguageChange={setStoryLanguage}
        mainGenre={mainGenre}
        onMainGenreChange={setMainGenre}
        storyTags={storyTags}
        onStoryTagsChange={setStoryTags}
        updateDays={storyUpdateDays}
        onToggleUpdateDay={toggleStoryUpdateDay}
        storyStatus={storyStatus}
        onStoryStatusChange={setStoryStatus}
        storyAdult={storyAdult}
        onStoryAdultChange={setStoryAdult}
       episodeAdult={episodeAdult}
onEpisodeAdultChange={setEpisodeAdult}
episodeFree={episodeFree}
onEpisodeFreeChange={setEpisodeFree}
releaseOption={releaseOption}
        onReleaseOptionChange={setReleaseOption}
        scheduleDate={scheduleDate}
        onScheduleDateChange={setScheduleDate}
        scheduleTime={scheduleTime}
        onScheduleTimeChange={setScheduleTime}
        saving={settingsSaving}
        onClose={() => setPublishSettingsOpen(false)}
        onSave={handleSavePublishSettings}
      />

      <EpisodeDetailsSheet
        open={episodeDetailsOpen}
        title={draftEpisodeTitle}
        cover={draftEpisodeCover}
        onTitleChange={setDraftEpisodeTitle}
        onCoverChange={handleCoverChange}
        onRemoveCover={() => {
          setDraftEpisodeCover('')
          setDraftCoverChanged(true)
        }}
        onClose={closeEpisodeDetails}
        onSave={saveEpisodeDetails}
      />

      <CropCoverModal
        open={cropOpen}
        image={tempCover}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onClose={() => setCropOpen(false)}
        onSave={handleSaveCoverCrop}
      />

      <UnsavedChangesModal
        open={showExitModal}
        onKeepEditing={() => setShowExitModal(false)}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraftAndLeave}
      />

      <LocalDraftRecoveryModal
        open={localRecoveryOpen}
        busy={localRecoveryBusy}
        onDiscard={handleDiscardLocalDraft}
        onRestore={handleRestoreLocalDraft}
      />

      {!isManga ? (
        <>

          <YouTubeVideoSheet
  open={youtubeSheetOpen}
  value={youtubeDraft}
  onChange={setYoutubeDraft}
  onClose={() => setYoutubeSheetOpen(false)}
  onSave={saveYouTubeVideo}
  onRemove={removeYouTubeVideo}
  hasVideo={Boolean(youtubeVideo.url)}
/>
          
          <CleanParagraphsModal
            open={cleanModalOpen}
            onCancel={() => setCleanModalOpen(false)}
            onClean={handleConfirmCleanParagraphs}
          />
          <RichFindReplacePanel
  open={findReplaceOpen}
  editorRef={editorRef}
  onClose={() => {
    setFindReplaceOpen(false)
    window.setTimeout(() => editorRef.current?.focus(), 60)
  }}
  onChange={(nextHtml) => syncEditorContent(nextHtml)}
  onMoreOptions={() => {
    setFindReplaceOpen(false)
    setSmartFindReplaceOpen(true)
  }}
/>

<SmartFindReplacePanel
  open={smartFindReplaceOpen}
  editorRef={editorRef}
  onClose={() => {
    setSmartFindReplaceOpen(false)
    window.setTimeout(() => editorRef.current?.focus(), 60)
  }}
  onChange={(nextHtml) => syncEditorContent(nextHtml)}
/>
        </>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-2.5">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={getDisplayText('episodeEditor.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-bold text-[var(--shadow-text-secondary)]">
              {isManga
                ? getDisplayText('episodeEditor.pageCount', { count: completedMangaPages.length.toLocaleString(getDisplayLanguageId()) })
                : getDisplayText('episodeEditor.characterCount', { count: characterCount.toLocaleString(getDisplayLanguageId()), minimum: MIN_CHARACTERS.toLocaleString(getDisplayLanguageId()) })}
            </div>
            <div className="mt-0.5 text-[10px] text-[var(--shadow-text-tertiary)]">
              {hasUnsavedChanges &&
              localDraftRevisionRef.current !== localSavedRevisionRef.current
                ? getDisplayText('episodeEditor.saveCountdown', { seconds: localSaveSeconds.toLocaleString(getDisplayLanguageId()) })
                : getDisplayText('episodeEditor.saved')}
            </div>
          </div>

          {!isManga ? (
            <>
              <button
                type="button"
                onClick={handleUndo}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
                aria-label={getDisplayText('episodeEditor.undo')}
              >
                <i className="fa-solid fa-rotate-left text-[17px]" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-tertiary)] active:scale-95"
                aria-label={getDisplayText('episodeEditor.redo')}
              >
                <i className="fa-solid fa-rotate-right text-[17px]" />
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={handleNext}
            disabled={!isValidForNext}
            className="ml-1 h-9 shrink-0 rounded-full bg-[var(--shadow-text-primary)] px-4 text-[12px] font-bold text-[var(--shadow-bg-surface)] active:scale-95 disabled:opacity-40"
          >
            {loading ? getDisplayText('episodeEditor.saving') : getDisplayText('episodeEditor.next')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-0 pt-0 sm:px-4 sm:pt-4">
        {isFirstEpisode ? (
  <section className="hidden rounded-[22px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)] sm:block">
    <div className="grid grid-cols-3 gap-2">
      <Step number="1" title={isManga ? getDisplayText('episodeEditor.mangaInfo') : getDisplayText('episodeEditor.storyInfo')} />
      <Step number="2" title={stepTitle} active />
      <Step number="3" title={getDisplayText('episodeEditor.publishStep')} />
    </div>
  </section>
) : null}

        {pageLoading ? (
          <section className="mx-4 mt-4 rounded-[12px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm sm:mx-0">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[var(--shadow-text-primary)]" />
            <div className="text-[13px] font-bold text-[var(--shadow-text-secondary)]">{getDisplayText('episodeEditor.loadingEpisodeData')}</div>
          </section>
        ) : null}

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[12px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d] sm:mx-0 sm:w-full"
          >
            {message}
          </button>
        ) : null}

        {!pageLoading ? (
  <>
    <div className="overflow-hidden bg-[var(--shadow-bg-surface)] sm:mt-4 sm:rounded-[12px] sm:shadow-sm md:contents">
      <section className="bg-[var(--shadow-bg-surface)] px-4 py-3 md:mt-4 md:rounded-[12px] md:shadow-sm">
        <button
          type="button"
          onClick={openEpisodeDetails}
          className="flex min-h-[54px] w-full items-center gap-3 border-b border-[var(--shadow-border)] text-left active:bg-[var(--shadow-bg-soft)]"
        >
          <div
            className={`min-w-0 flex-1 truncate text-[14px] font-semibold ${
              episodeTitle ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-placeholder)]'
            }`}
          >
            {episodeTitle || getDisplayText('episodeEditor.enterEpisodeTitlePrompt')}
          </div>

          {episodeCover ? (
            <img
              src={episodeCover}
              alt=""
              className="h-9 w-16 shrink-0 rounded-[8px] object-cover"
            />
          ) : null}

          <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[var(--shadow-text-disabled)]" />
        </button>
      </section>

            {isManga ? (
              <section className="bg-[var(--shadow-bg-surface)] p-4 md:mt-4 md:rounded-[12px] md:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('episodeEditor.mangaPages')}</h2>
                    <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">
                      {getDisplayText('episodeEditor.mangaPickHelp')}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                    {completedMangaPages.length}/{MANGA_MAX_PAGES}
                  </div>
                </div>

                <ImageDropZone
                  onFiles={handlePickMangaPages}
                  multiple
                  disabled={mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES}
                  className="mt-4 rounded-[20px]"
                  label={getDisplayText('episodeEditor.dropMangaPages')}
                >
                  <label
                    className={`flex min-h-[120px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] text-center ${
                      mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES
                        ? 'pointer-events-none opacity-55'
                        : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
                      <i className="fa-solid fa-images text-[17px]" />
                    </div>
                    <div className="mt-3 text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
                      {mangaUploadPending ? getDisplayText('episodeEditor.uploadingPages') : getDisplayText('episodeEditor.dropOrAddManga')}
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--shadow-text-tertiary)]">{getDisplayText('episodeEditor.mangaFileTypes')}</div>
                    <input
                      type="file"
                      accept="image/*,.heic,.heif"
                      multiple
                      className="hidden"
                      disabled={mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES}
                      onChange={(event) => {
                        handlePickMangaPages(event.target.files)
                        event.target.value = ''
                      }}
                    />
                  </label>
                </ImageDropZone>

                {mangaPages.length ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {mangaPages.map((page, index) => (
                      <MangaPageCard
                        key={page.id}
                        page={page}
                        index={index}
                        total={mangaPages.length}
                        onMove={handleMoveMangaPage}
                        onDelete={handleDeleteMangaPage}
                        onReplace={handleReplaceMangaPage}
                        onRetry={handleRetryMangaPage}
                        disabled={mangaUploadPending}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[18px] bg-[#fff7df] px-4 py-3 text-[12px] font-bold leading-5 text-[#a56a00]">
                    {getDisplayText('episodeEditor.mangaDraftHelp', {
                      count: MANGA_MIN_PUBLISH_PAGES.toLocaleString(getDisplayLanguageId()),
                    })}
                  </div>
                )}

                {warningText ? (
                  <div className="mt-4 rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[12px] font-bold leading-5 text-[var(--shadow-text-secondary)]">
  {warningText}
</div>
                ) : (
                  <div className="mt-4 rounded-[16px] bg-[#ecfdf3] px-4 py-3 text-[12px] font-bold leading-5 text-[#16803c]">
                    {getDisplayText('episodeEditor.mangaReady')}
                  </div>
                )}
              </section>
            ) : (
              <section className="bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-0 md:mt-4 md:rounded-[12px] md:p-4 md:shadow-sm">
                <div className="hidden items-center gap-2 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] py-2 md:sticky md:top-[57px] md:z-40 md:-mx-4 md:flex md:px-4">
  <ToolButton
    Icon={Bold}
    label={getDisplayText('episodeEditor.bold')}
    active={boldActive}
    onClick={() => runEditorCommand('bold')}
  />

  <ToolButton
    Icon={Italic}
    label={getDisplayText('episodeEditor.italic')}
    active={italicActive}
    onClick={() => runEditorCommand('italic')}
  />

  <ToolButton
    Icon={
      alignmentMode === 'center'
        ? AlignCenter
        : alignmentMode === 'right'
          ? AlignRight
          : AlignLeft
    }
    label={`Align ${alignmentMode}`}
    onClick={handleAlignmentChange}
  />

  <ToolButton
    Icon={ImageIcon}
    label="Insert image"
    disabled={inlineImageUploading}
    onClick={() => {
      saveEditorSelection()
      imageInputRef.current?.click()
    }}
  />

  <ToolButton
  Icon={WandSparkles}
  label="AI Space"
  onClick={() => setCleanModalOpen(true)}
/>

<ToolButton
  Icon={Link}
  label="YouTube video"
  onClick={openYouTubeSheet}
/>

<ToolButton
  Icon={Search}
    label="Find and Replace"
    onClick={() => setFindReplaceOpen(true)}
  />
</div>
                <div
                  ref={editorRef}
                  contentEditable
                  spellCheck={storyLanguage === 'English'}
                  autoCorrect={storyLanguage === 'English' ? 'on' : 'off'}
                  lang={storyLanguage === 'English' ? 'en' : undefined}
                  suppressContentEditableWarning
                  role="textbox"
                  aria-multiline="true"
                  data-placeholder={getDisplayText('episodeEditor.startWriting')}
                  onInput={handleEditorInput}
                  onBeforeInput={handleEditorBeforeInput}
                  onPaste={handleEditorPaste}
                  onKeyDown={handleEditorKeyDown}
                  onFocus={() => {
                    setEditorFocused(true)
                    saveEditorSelection()
                  }}
                  onBlur={() => {
                    window.setTimeout(() => {
                      if (
  findReplaceOpen ||
  cleanModalOpen ||
  youtubeSheetOpen ||
  inlineImageUploading
) {
  return
}
                      setEditorFocused(false)
                      setSaveStatus('Saved')
                    }, 220)
                  }}
                  onKeyUp={saveEditorSelection}
                  onMouseUp={saveEditorSelection}
                  onTouchEnd={saveEditorSelection}
                  className="rich-episode-editor min-h-[calc(100dvh-120px)] w-full bg-[var(--shadow-bg-surface)] px-0 pb-24 pt-3 text-[15px] leading-8 text-[var(--shadow-text-primary)] outline-none md:min-h-[calc(100dvh-170px)] md:rounded-[10px] md:px-4"
                />

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  className="hidden"
                  onChange={(event) => handleInlineImagePick(event.target.files?.[0] || null)}
                />

                {editorFocused ? (
                  <div className="fixed inset-x-0 bottom-0 z-[90] bg-[var(--shadow-bg-surface)] pb-[env(safe-area-inset-bottom)] md:hidden">
                    <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto bg-[var(--shadow-bg-surface)] px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <ToolButton
  Icon={Bold}
  label={getDisplayText('episodeEditor.bold')}
  active={boldActive}
  onClick={() => runEditorCommand('bold')}
/>

<ToolButton
  Icon={Italic}
  label={getDisplayText('episodeEditor.italic')}
  active={italicActive}
  onClick={() => runEditorCommand('italic')}
/>

<ToolButton
  Icon={
    alignmentMode === 'center'
      ? AlignCenter
      : alignmentMode === 'right'
        ? AlignRight
        : AlignLeft
  }
  label={`Align ${alignmentMode}`}
  onClick={handleAlignmentChange}
/>

<ToolButton
  Icon={ImageIcon}
  label="Insert image"
  disabled={inlineImageUploading}
  onClick={() => {
    saveEditorSelection()
    imageInputRef.current?.click()
  }}
/>

<ToolButton
  Icon={WandSparkles}
  label="AI Space"
  onClick={() => setCleanModalOpen(true)}
/>

<ToolButton
  Icon={Link}
  label="YouTube video"
  onClick={openYouTubeSheet}
/>

<ToolButton
  Icon={Search}
  label="Find and Replace"
  onClick={() => setFindReplaceOpen(true)}
/>
                    </div>
                  </div>
                ) : null}
              </section>
            )}
            </div>

          </>
        ) : null}
      </main>
    </div>
  )
}
