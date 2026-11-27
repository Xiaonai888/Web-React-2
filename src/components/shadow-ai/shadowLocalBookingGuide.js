const labels=Object.freeze({name:'name',phone_number:'phone',delivery_address:'address',second_phone:'second phone',telegram_username:'telegram',facebook_link:'facebook',signature_name:'signature name',english_buyer_name:'english name',english_signature_name:'english signature name',detailed_address:'detailed address',buyer_note:'note'})
const limits=Object.freeze({name:160,phone_number:28,delivery_address:800,second_phone:28,telegram_username:250,facebook_link:500,signature_name:160,english_buyer_name:160,english_signature_name:160,detailed_address:800,buyer_note:1000})
const safeValue=v=>typeof v==='string'&&v.trim()&&!/[\r\n\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(v)&&v.trim().length<=1000
const key=v=>v.normalize('NFKC').replace(/[\u200b-\u200d\ufeff]/gu,'').replace(/[០-៩]/gu,c=>String(c.codePointAt(0)-0x17e0)).toLowerCase().trim().replace(/\s+/gu,' ')
function uniqueTitle(book,books){return safeValue(book?.title)&&books.filter(b=>typeof b?.title==='string'&&key(b.title)===key(book.title)).length===1}
const positive=v=>Number.isSafeInteger(v)&&v>0
export function getShadowLocalBookingGuide(session){
  const missing=session?.validation?.missing,context=session?.context,draft=session?.draft
  if(!Array.isArray(missing)||!Array.isArray(context?.books)||context.books.length>10||!Array.isArray(context.delivery_companies)||context.delivery_companies.length>32||!Array.isArray(draft?.items)||draft.items.length>10||session.validation.ready)return null
  for(const field of missing.slice(0,40)){
    if(typeof field!=='string')continue
    const [kind,id]=field.split(':')
    if(kind==='items'){
      const choices=context.books.filter(b=>uniqueTitle(b,context.books)&&Array.isArray(b.editions)&&b.editions.some(e=>positive(e.available))).map(b=>({value:b.title,label:b.title,message:`book: ${b.title}`}))
      if(choices.length)return {field,kind,choices}
    }else if(kind==='edition'||kind==='quantity'){
      const book=context.books.find(b=>b.id===id),item=draft.items.find(i=>i.book_id===id)
      if(!book||!item||!uniqueTitle(book,context.books)||!Array.isArray(book.editions))continue
      const prefix=`book: ${book.title}\n`
      if(kind==='edition'){
        const choices=book.editions.filter(e=>['standard','limited'].includes(e.edition)&&positive(e.available)).map(e=>({value:e.edition,labelKey:e.edition,message:prefix+`edition: ${e.edition}`}))
        if(choices.length)return {field,kind,bookTitle:book.title,choices}
      }else{
        const edition=book.editions.find(e=>e.edition===item.edition)
        if(positive(edition?.available))return {field,kind,bookTitle:book.title,prefix:prefix+'quantity: ',max:Math.min(99,edition.available)}
      }
    }else if(kind==='delivery_company_key'){
      const choices=context.delivery_companies.filter(c=>typeof c.company_key==='string'&&/^[a-z0-9][a-z0-9_-]{0,63}$/u.test(c.company_key)&&safeValue(c.company_name)).map(c=>({value:c.company_key,label:c.company_name,message:`delivery company: ${c.company_key}`}))
      if(choices.length)return {field,kind,choices}
    }else if(kind==='signature_requested'&&context.signature_enabled){
      return {field,kind,choices:[{value:'yes',labelKey:'yes',message:'signature: yes'},{value:'no',labelKey:'no',message:'signature: no'}]}
    }else if(Object.hasOwn(labels,kind)){
      return {field,kind,prefix:labels[kind]+': ',max:limits[kind]}
    }
  }
  return null
}
export function composeShadowLocalGuideMessage(guide,value){
  if(!guide||typeof value!=='string')return null
  if(Array.isArray(guide.choices))return guide.choices.find(c=>c.value===value)?.message??null
  if(!safeValue(value)||typeof guide.prefix!=='string'||!positive(guide.max))return null
  const text=value.trim()
  if(guide.kind==='quantity'){
    const digits=text.replace(/[០-៩]/gu,c=>String(c.codePointAt(0)-0x17e0))
    if(!/^[1-9][0-9]?$/u.test(digits)||Number(digits)>guide.max)return null
    return guide.prefix+digits
  }
  return text.length<=guide.max?guide.prefix+text:null
}
