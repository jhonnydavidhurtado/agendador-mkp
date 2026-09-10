import { useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const form = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const submit = (e) => {
        e.preventDefault();

        form.patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={form.data.name}
                        onChange={(e) =>
                            form.setData('name', e.target.value)
                        }
                        required
                        autoComplete="name"
                    />

                    <InputError
                        className="mt-2"
                        message={form.errors.name}
                    />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={form.data.email}
                        onChange={(e) =>
                            form.setData('email', e.target.value)
                        }
                        required
                        autoComplete="username"
                    />

                    <InputError
                        className="mt-2"
                        message={form.errors.email}
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                        </p>
                    </div>
                )}

                {status === 'profile-updated' && (
                    <p className="text-sm font-medium text-green-600">
                        Profile updated successfully.
                    </p>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={form.processing}>
                        {form.processing ? 'Guardando...' : 'Save'}
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}