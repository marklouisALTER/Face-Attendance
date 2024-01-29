import { create } from 'zustand'

// for steps in user registration
type useForm = {
    step: number;
    setIncrementStep: () => void; 
    setDecrementStep: () => void;
}

// For teacher registration 
type useFormData = {
    formData: {
        employee_id: string,
        first_name: string,
        last_name: string,
        face_image: Blob,
        eyebrows: Blob,
        leyes: Blob,
        reyes: Blob,
        nose: Blob,
        mouth: Blob,    
    }
    updateFormData: (data: Partial<useFormData['formData']>) => void
}

// for user session
type userSession = {
    formSession: {
        user: string;
        token: string; 
    },
    updateSession: (data: userSession['formSession']) => void;
}

// for teacher profile array store 
type teacherProfile = {
    employee_id: number;
    first_name: string;
    last_name: string;
    face_image: string;
}

// for teacher profile array store
type teacherProfileStore = {
    teacherProfiles: teacherProfile[],
    addTeacherProfiles: (teacher: teacherProfile) => void;
}

// to get the teacher id
type getTeacherId = {
    teacher: teacherProfile;
    setTeacherId: (value: getTeacherId['teacher']) => void;
    removeTeacherId: () => void;
}

type updateModalType ={
    updateModal: boolean;
    setUpdateModal: (value: boolean) => void;
}

//attendance type
type getAttendanceType = {
    attendance_id: number;
    employee_id: number;
    full_name: string;
    date: string;
    time_in: string;
    time_out: string;
}

// attendance function type
type updateAttendanceType = {
    attendanceInfo: getAttendanceType;
    updateAttendanceInfo: (value: getAttendanceType) => void;
    removeAttendanceInfo: () => void;
}

type updateAttendanceModalType = {
    updateAttendanceModal: boolean;
    setUpdateAttendanceModal: (value: boolean) => void;
}

// for steps in registration state management
export const useFormStore = create<Pick<useForm, 'step'| 'setIncrementStep'| 'setDecrementStep'>>((set) => ({
    step: 0,
    setIncrementStep: () => set((state) => ({step: state.step + 1})),
    setDecrementStep: () => set((state) => ({step: Math.max(0, state.step - 1)}))
}))

// for new teacher registration form state management
export const useFormDataStore = create<useFormData>((set) => ({
    formData: {
        employee_id: '',
        first_name: '',
        last_name: '',
        face_image: new Blob(),
        eyebrows: new Blob(),
        leyes: new Blob(),
        reyes: new Blob(),
        nose: new Blob(),
        mouth: new Blob(),
    },
    updateFormData : (data) => set((state) => ({formData:{ ...state.formData, ...data } }))
}))

// State management for user Session
export const useUserSessionStore =create<userSession>((set) => ({
    formSession : {
        user: '',
        token: ''
    },
    updateSession : (data) => set((state) => ({formSession: {...state.formSession, ...data} }))
}))

// State management for teacher profile array
export const useTeacherProfile =create<teacherProfileStore>((set) => ({
    teacherProfiles: [], 
    addTeacherProfiles: (profile) => set((state) => ({teacherProfiles: [...state.teacherProfiles, profile]}))
}))

// for teacher view profile in Employee Module table
export const useTeacherIdentity = create<getTeacherId>((set) => ({
    teacher:{
        employee_id: 0,
        first_name: '',
        last_name: '',
        face_image: ''
    
    },
    setTeacherId: (value) => set({teacher: value}),
    removeTeacherId: () => set({teacher: {employee_id: 0, first_name: '', last_name: '', face_image: ''}})
}))

// state mangement for update teacher modal --toggle--
export const useUpdateModal = create<updateModalType>((set) => ({
    updateModal: false,
    setUpdateModal: (value) => set({updateModal: value })
}))

// state management for attendance modal view/update attendance record 
export const useAttendanceModal = create<updateAttendanceType>((set) => ({
    attendanceInfo: {
        attendance_id: 0,
        employee_id: 0,
        full_name: '',
        date: '',
        time_in: '',
        time_out: ''
    },
    updateAttendanceInfo: (value) => set({attendanceInfo: value}),
    removeAttendanceInfo: () => set({attendanceInfo: {attendance_id: 0, employee_id: 0, full_name: '', date: '', time_in: '', time_out: ''}}) 
}))

// state management for update attendance modal
export const useUpdateAttendanceModal = create<updateAttendanceModalType>((set) => ({
    updateAttendanceModal: false,
    setUpdateAttendanceModal: (value) => set({updateAttendanceModal: value})
}))

type attendanceRecordType = {
    attendance_id: number;
    employee_id: number;
    full_name: string;
    date: string;
    time_in: string;
    time_out: string;
}

type attendanceRecordArr = {
    attendanceRecord: attendanceRecordType[];
    updateAttendanceRecord: (newAttendanceRecord: attendanceRecordType[]) => void;
}

export const useAttendanceRecord = create<attendanceRecordArr>((set) => ({
    attendanceRecord: [],
    updateAttendanceRecord: (newAttendanceRecord) => set({attendanceRecord: newAttendanceRecord}),
}))


type transactionHistoryType = {
    id: number;
    transaction_id: string;
    face_image: string;
    eyebrows_perc: number;
    leyes_perc: number;
    reyes_perc: number;
    nose_perc: number;
    mouth_perc: number;
    create_At: Date;
    overall_perc: number;
}

type transactionManagementType = {
    transactionHistory: transactionHistoryType[];
    updateTransactionHistory: (newTransactionHistory: transactionHistoryType[]) => void;
}

export const useTransactionHistory = create<transactionManagementType>((set) => ({
    transactionHistory: [],
    updateTransactionHistory: (newTransactionHistory) => set({transactionHistory: newTransactionHistory}),
}))