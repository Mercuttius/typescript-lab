import Lab from '@/components/lab';
import { publicExercises } from '@/lib/catalog';
export default function Home(){return <Lab exercises={publicExercises()}/>}
